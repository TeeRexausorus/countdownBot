/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('countup', {
        date: { type: 'date', notNull: true},
    });
    pgm.createTable('userEmoji', {
        username: {
            type: 'varchar(40)',
            notNull: true,
            unique: true
        },
        emoji: {
            type: 'varchar(40)'
        },
        nbUse: { type: 'integer' },
    })
};
exports.down = pgm => {};
