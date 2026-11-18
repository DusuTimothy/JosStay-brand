'use strict';

/**
 * A unique key keeps a retried refund request from calling Paystack twice.
 * It is internal; guests only ever see the refund status and amount.
 */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn('refunds', 'idempotency_key', {
      type: 'TEXT',
      allowNull: true,
      unique: true,
    });

    await queryInterface.sequelize.query(`
      COMMENT ON COLUMN "refunds"."idempotency_key" IS
        'Internal retry key derived from booking, reason and amount; never guest-facing.'
    `);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('refunds', 'idempotency_key');
  },
};
