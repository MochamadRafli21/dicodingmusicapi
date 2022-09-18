/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('playlist', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
          },
        name: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
            foreignKey: true,
        }
    });

    pgm.addConstraint('playlist', 'fk_playlist.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  };
   
  exports.down = (pgm) => {
    pgm.dropConstraint('playlist', 'fk_playlist.owner_users.id');

    pgm.dropTable('playlist');
  };
