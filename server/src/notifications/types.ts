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

export type GuestRefundEmailMessage = {
  kind: "guest-refund-email";
  bookingReference: string;
  to: string;
  subject: string;
  text: string;
  hotelPhoneIncluded: false;
};

export type GuestRefundWhatsAppMessage = {
  kind: "guest-refund-whatsapp";
  bookingReference: string;
  to: string;
  text: string;
  hotelPhoneIncluded: false;
};

export type RefundMessage = GuestRefundEmailMessage | GuestRefundWhatsAppMessage;

export type NotificationMessage = ConfirmationMessage | RefundMessage;

export type NotificationResult = {
  sent: NotificationMessage["kind"][];
  failed: NotificationMessage["kind"][];
  skipped: NotificationMessage["kind"][];
};

export interface NotificationClient {
  send(message: NotificationMessage): Promise<void>;
}
