import { Op, type WhereOptions } from "sequelize";
import type { Request, Response } from "express";
import {
  AreaSummarySchema,
  HotelDetailSchema,
  HotelQuerySchema,
  PublicHotelSchema,
  SlugSchema,
  VerificationStatusSchema,
  type AreaSummary,
  type PublicHotel,
  type VerificationStatus,
} from "@josstay/shared";
import { getModels } from "../db/client.js";
import { PUBLIC_HOTEL_ATTRIBUTES } from "../db/public-fields.js";
import { availableRoomIds } from "./availability.js";
import { HttpError, parseWith } from "./errors.js";

type HotelRecord = {
  id: string;
  slug: string;
  name: string;
  areaId: string;
  address: string;
  lat: number;
  lng: number;
  nightlyKobo: number | string;
  policyTemplate: PublicHotel["policyTemplate"];
  demo: boolean;
  area?: { slug: string; name: string };
};

type VerificationRecord = {
  hotelId: string;
  inspectedAt: Date | string;
  status: string;
};

type RoomRecord = {
  id: string;
  name: string;
  bed: string;
  sleeps: number;
  ensuite: boolean;
};

function plain<T>(model: { get(options: { plain: true }): unknown }): T {
  return model.get({ plain: true }) as T;
}

function intersectingIds(sets: Set<string>[]): string[] | undefined {
  if (sets.length === 0) return undefined;
  const [first, ...rest] = sets;
  return [...first].filter((id) => rest.every((set) => set.has(id)));
}

async function latestVerifications(
  hotelIds: string[],
): Promise<Map<string, VerificationRecord>> {
  if (hotelIds.length === 0) return new Map();

  const { Verification } = getModels();
  const rows = await Verification.findAll({
    attributes: ["hotelId", "inspectedAt", "status"],
    where: { hotelId: { [Op.in]: hotelIds } },
    order: [["inspectedAt", "DESC"]],
  });

  const latest = new Map<string, VerificationRecord>();
  for (const row of rows) {
    const record = plain<VerificationRecord>(row);
    if (!latest.has(record.hotelId)) latest.set(record.hotelId, record);
  }
  return latest;
}

async function poweredHotelIds(hotelIds: string[]): Promise<Set<string>> {
  if (hotelIds.length === 0) return new Set();

  const { Verification } = getModels();
  const rows = await Verification.findAll({
    attributes: ["hotelId", "inspectedAt", "status", "checksJson"],
    where: { hotelId: { [Op.in]: hotelIds } },
    order: [["inspectedAt", "DESC"]],
  });

  const latest = new Map<string, (typeof rows)[number]>();
  for (const row of rows) {
    const hotelId = row.get("hotelId") as string;
    if (!latest.has(hotelId)) latest.set(hotelId, row);
  }

  const powered = new Set<string>();
  for (const [hotelId, row] of latest) {
    const status = VerificationStatusSchema.safeParse(row.get("status"));
    if (!status.success || status.data === "Fail") continue;

    const checks = row.get("checksJson") as Record<string, unknown> | null;
    if (checks?.power === true || checks?.power === "true") powered.add(hotelId);
  }
  return powered;
}

function publicStatus(verification: VerificationRecord | undefined): VerificationStatus | undefined {
  if (!verification) return undefined;
  const parsed = VerificationStatusSchema.safeParse(verification.status);
  if (!parsed.success || parsed.data === "Fail") return undefined;
  return parsed.data;
}

function mapHotel(
  record: HotelRecord,
  verification: VerificationRecord | undefined,
): PublicHotel {
  if (!record.area) throw new Error("Hotel record is missing its area");

  const status = publicStatus(verification);
  return PublicHotelSchema.parse({
    slug: record.slug,
    name: record.name,
    area: record.area.name,
    address: record.address,
    lat: record.lat,
    lng: record.lng,
    nightlyKobo: Number(record.nightlyKobo),
    policyTemplate: record.policyTemplate,
    demo: record.demo,
    ...(verification && status
      ? { inspectedAt: verification.inspectedAt, verificationStatus: status }
      : {}),
  });
}

export async function listHotels(request: Request, response: Response): Promise<void> {
  const query = parseWith(HotelQuerySchema, request.query);
  const models = getModels();

  const where: Record<string, unknown> = { status: "published" };
  const candidateSets: Set<string>[] = [];

  if (query.area) {
    const area = await models.Area.findOne({
      attributes: ["id"],
      where: {
        [Op.or]: [
          { slug: { [Op.iLike]: query.area } },
          { name: { [Op.iLike]: query.area } },
        ],
      },
    });
    if (!area) {
      response.json([]);
      return;
    }
    where.areaId = area.get("id");
  }

  if (query.policy) where.policyTemplate = query.policy;

  if (query.dates) {
    const { hotelIds } = await availableRoomIds(
      query.dates.from,
      query.dates.to,
      query.guests,
    );
    candidateSets.push(new Set(hotelIds));
  } else if (query.guests) {
    const rooms = await models.Room.findAll({
      attributes: ["hotelId"],
      where: { sleeps: { [Op.gte]: query.guests } },
      group: ["hotel_id"],
    });
    candidateSets.push(
      new Set(rooms.map((room) => room.get("hotelId") as string)),
    );
  }

  let candidateIds = intersectingIds(candidateSets);
  if (query.power === "24-7") {
    const forPower =
      candidateIds ??
      (await models.Hotel.findAll({ attributes: ["id"], where: { status: "published" } })).map(
        (hotel) => hotel.get("id") as string,
      );
    candidateSets.push(await poweredHotelIds(forPower));
    candidateIds = intersectingIds(candidateSets);
  }

  if (candidateIds) {
    if (candidateIds.length === 0) {
      response.json([]);
      return;
    }
    where.id = { [Op.in]: candidateIds };
  }

  const rows = await models.Hotel.findAll({
    attributes: [...PUBLIC_HOTEL_ATTRIBUTES],
    where: where as WhereOptions,
    include: [{ model: models.Area, as: "area", attributes: ["slug", "name"] }],
    order: [["name", "ASC"]],
  });

  const records = rows.map((row) => plain<HotelRecord>(row));
  const verifications = await latestVerifications(
    records.map((record) => record.id),
  );
  response.json(
    records.map((record) => mapHotel(record, verifications.get(record.id))),
  );
}

export async function getHotel(request: Request, response: Response): Promise<void> {
  const slug = parseWith(SlugSchema, request.params.slug);
  const models = getModels();

  const row = await models.Hotel.findOne({
    attributes: [...PUBLIC_HOTEL_ATTRIBUTES],
    where: { slug, status: "published" },
    include: [{ model: models.Area, as: "area", attributes: ["slug", "name"] }],
  });
  if (!row) throw new HttpError(404, "Hotel not found");

  const hotelId = row.get("id") as string;
  const [roomRows, verifications] = await Promise.all([
    models.Room.findAll({
      attributes: ["id", "name", "bed", "sleeps", "ensuite"],
      where: { hotelId },
      order: [["name", "ASC"]],
    }),
    latestVerifications([hotelId]),
  ]);

  const record = plain<HotelRecord>(row);
  const rooms = roomRows.map((room) => plain<RoomRecord>(room));
  const detail = HotelDetailSchema.parse({
    ...mapHotel(record, verifications.get(hotelId)),
    rooms,
  });
  response.json(detail);
}

export async function listAreas(_request: Request, response: Response): Promise<void> {
  const models = getModels();
  const [areaRows, hotelRows] = await Promise.all([
    models.Area.findAll({
      attributes: ["id", "slug", "name", "centreLat", "centreLng"],
      order: [["name", "ASC"]],
    }),
    models.Hotel.findAll({
      attributes: ["id", "areaId", "demo"],
      where: { status: "published" },
    }),
  ]);

  const byArea = new Map<string, boolean[]>();
  for (const hotel of hotelRows) {
    const areaId = hotel.get("areaId") as string;
    const demos = byArea.get(areaId) ?? [];
    demos.push(Boolean(hotel.get("demo")));
    byArea.set(areaId, demos);
  }

  const areas: AreaSummary[] = areaRows.map((area) => {
    const id = area.get("id") as string;
    const demos = byArea.get(id) ?? [];
    return AreaSummarySchema.parse({
      slug: area.get("slug"),
      name: area.get("name"),
      centreLat: area.get("centreLat"),
      centreLng: area.get("centreLng"),
      count: demos.length,
      demo: demos.length > 0 && demos.every(Boolean),
    });
  });
  response.json(areas);
}
