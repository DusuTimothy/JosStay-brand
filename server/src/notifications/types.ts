/** Confirmation payloads. The phone is only ever present in the guest email. */
export type GuestEmailMessage = {
  kind: "guest-email";
  bookingReference: string;
  to: string;
  subject: string;
  text: string;
  hotelPhoneIncluded: boolean;
};

export type GuestWhatsAppMessage = {
  kind: "guest-whatsapp";
  bookingReference: string;
  to: string;
  text: string;
  hotelPhoneIncluded: false;
};

export type HotelEmailMessage = {
  kind: "hotel-email";
  bookingReference: string;
  to: string;
  subject: string;
  text: string;
  guestContactIncluded: false;
};

export type ConfirmationMessage =
  | GuestEmailMessage
  | GuestWhatsAppMessage
  | HotelEmailMessage;

export type NotificationResult = {
  sent: ConfirmationMessage["kind"][];
  failed: ConfirmationMessage["kind"][];
  skipped: ConfirmationMessage["kind"][];
};

export interface NotificationClient {
  send(message: ConfirmationMessage): Promise<void>;
}
