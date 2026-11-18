'use strict';

/**
 * Internal hotel contact email for booking confirmations, plus the guest's
 * WhatsApp opt-in on the booking record. Neither column is public.
 */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn('hotels', 'contact_email', {
      type: 'TEXT',
      allowNull: true,
    });
    await queryInterface.addColumn('bookings', 'whatsapp_opt_in', {
      type: 'BOOLEAN',
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.sequelize.query(`
      COMMENT ON COLUMN "hotels"."contact_email" IS
        'Internal only. Hotel confirmation email recipient; never select into a public API response.'
    `);
    await queryInterface.sequelize.query(`
      COMMENT ON COLUMN "bookings"."whatsapp_opt_in" IS
        'Guest consent for the booking confirmation on WhatsApp, captured at checkout.'
    `);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('bookings', 'whatsapp_opt_in');
    await queryInterface.removeColumn('hotels', 'contact_email');
  },
};
