"use client";

import { Download, Info } from "lucide-react";
import { usePartnerData } from "@/components/partner/partner-data-provider";
import {
  EmptyState,
  Notice,
  PartnerCard,
  PartnerHeading,
  PartnerStat,
  StatusBadge,
} from "@/components/partner/partner-ui";
import { Button } from "@/components/ui/button";
import { naira } from "@/lib/format";
import { downloadCsv, formatDate } from "@/lib/partner-view";

export function PartnerPayouts() {
  const { selectedHotel } = usePartnerData();

  if (!selectedHotel) {
    return <EmptyState title="No property in this snapshot" body="Reset the sample data to continue." />;
  }

  const payouts = [...selectedHotel.payouts].sort((a, b) => b.date.localeCompare(a.date));
  const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
  const gross = sum(payouts.map((payout) => payout.grossKobo));
  const commission = sum(payouts.map((payout) => payout.commissionKobo));
  const fees = sum(payouts.map((payout) => payout.paystackFeeKobo));
  const net = sum(payouts.map((payout) => payout.netKobo));
  const paid = sum(
    payouts.filter((payout) => payout.status === "paid").map((payout) => payout.netKobo),
  );
  const scheduled = sum(
    payouts.filter((payout) => payout.status === "scheduled").map((payout) => payout.netKobo),
  );
  const next = payouts.filter((payout) => payout.status === "scheduled").at(-1);

  function exportStatement() {
    downloadCsv(
      `josstay-sample-payouts-${selectedHotel!.slug}.csv`,
      ["Period", "Payout date", "Gross (NGN)", "Commission 10% (NGN)", "Paystack fee (NGN)", "Net to hotel (NGN)", "Status"],
      payouts.map((payout) => [
        payout.period,
        payout.date,
        String(payout.grossKobo / 100),
        String(payout.commissionKobo / 100),
        String(payout.paystackFeeKobo / 100),
        String(payout.netKobo / 100),
        payout.status,
      ]),
    );
  }

  return (
    <>
      <PartnerHeading
        eyebrow="Payouts"
        title="Money, without a mystery fee"
        description="Sample payout records. Guests pay one all-in price; JosStay takes a fixed 10% commission from the hotel and the hotel bears the Paystack fee."
        actions={
          <Button variant="secondary" size="md" onClick={exportStatement} disabled={payouts.length === 0}>
            <Download className="size-4" aria-hidden="true" />
            Statement CSV
          </Button>
        }
      />

      <Notice tone="info">
        These are invented figures for a sample dashboard. No payout has been made and no Paystack
        account is connected.
      </Notice>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <PartnerStat label="Gross sample bookings" value={naira(gross / 100)} note="All-in guest totals" tint="pine" />
        <PartnerStat label="JosStay commission" value={naira(commission / 100)} note="Fixed 10% of gross" />
        <PartnerStat label="Paystack fee" value={naira(fees / 100)} note="Borne by the hotel" />
        <PartnerStat label="Net to hotel" value={naira(net / 100)} note="Gross less commission and fee" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
        <PartnerCard title="Payout records" description={`${payouts.length} sample records for this property.`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-[0.8125rem]">
              <thead>
                <tr className="border-b border-zinc-200 text-[0.6875rem] uppercase tracking-[0.06em] text-zinc-500">
                  <th className="py-2.5 pr-3 font-bold">Period</th>
                  <th className="py-2.5 pr-3 font-bold">Date</th>
                  <th className="py-2.5 pr-3 font-bold">Gross</th>
                  <th className="py-2.5 pr-3 font-bold">10%</th>
                  <th className="py-2.5 pr-3 font-bold">Paystack fee</th>
                  <th className="py-2.5 pr-3 font-bold">Net</th>
                  <th className="py-2.5 font-bold"><span className="sr-only">Status</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {payouts.map((payout) => (
                  <tr key={payout.id}>
                    <td className="py-3 pr-3 font-semibold text-obsidian">{payout.period}</td>
                    <td className="py-3 pr-3 text-zinc-600">{formatDate(payout.date)}</td>
                    <td className="py-3 pr-3 text-zinc-700">{naira(payout.grossKobo / 100)}</td>
                    <td className="py-3 pr-3 text-zinc-700">{naira(payout.commissionKobo / 100)}</td>
                    <td className="py-3 pr-3 text-zinc-700">{naira(payout.paystackFeeKobo / 100)}</td>
                    <td className="py-3 pr-3 font-semibold text-obsidian">{naira(payout.netKobo / 100)}</td>
                    <td className="py-3 text-right"><StatusBadge status={payout.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PartnerCard>

        <div className="space-y-5">
          <PartnerCard title="How the split reads" description="Same maths the payment adapter uses.">
            <ol className="space-y-3 text-[0.8125rem] leading-relaxed text-zinc-700">
              <li className="flex gap-3">
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-pine-800 text-[0.6875rem] font-bold text-white">1</span>
                Guest pays the all-in total. There is no separate service-fee line.
              </li>
              <li className="flex gap-3">
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-pine-800 text-[0.6875rem] font-bold text-white">2</span>
                JosStay keeps 10% of that total as commission.
              </li>
              <li className="flex gap-3">
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-pine-800 text-[0.6875rem] font-bold text-white">3</span>
                Paystack's fee is charged to the hotel subaccount, not added to the guest bill.
              </li>
              <li className="flex gap-3">
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-pine-800 text-[0.6875rem] font-bold text-white">4</span>
                The remainder is the hotel's net. Refund reversals follow the signed webhook rules.
              </li>
            </ol>
          </PartnerCard>

          <PartnerCard title="Paid and scheduled" description="Sample summary, not a bank balance.">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 text-[0.8125rem]">
              <span className="text-zinc-600">Already paid</span>
              <span className="font-semibold text-obsidian">{naira(paid / 100)}</span>
            </div>
            <div className="flex items-center justify-between py-3 text-[0.8125rem]">
              <span className="text-zinc-600">Scheduled</span>
              <span className="font-semibold text-obsidian">{naira(scheduled / 100)}</span>
            </div>
            {next ? (
              <div className="rounded-lg border border-pine-200 bg-pine-50 p-3">
                <p className="text-[0.75rem] font-semibold text-pine-900">Next sample date</p>
                <p className="mt-1 text-[0.8125rem] text-pine-900">
                  {formatDate(next.date)} · {naira(next.netKobo / 100)} net
                </p>
              </div>
            ) : null}
          </PartnerCard>

          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <Info className="size-4 text-pine-700" aria-hidden="true" />
            <p className="mt-2 text-[0.8125rem] font-semibold text-obsidian">Timing is provider-led</p>
            <p className="mt-1 text-[0.75rem] leading-relaxed text-zinc-600">
              Paystack payouts follow T+1/T+2 and subaccount verification. This sample never claims a
              real transfer date.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
