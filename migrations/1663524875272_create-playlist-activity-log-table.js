/* eslint-disable camelcase */
  
exports.up = (pgm) => {
  // membuat table collaborations
  pgm.createTable('playlist_log', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    songs_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
    time: {
        type: 'TEXT',
        notNull: true,
    },
    action: {
        type: 'TEXT',
        notNull: true,
    },
  });
 
 
  // memberikan constraint foreign key pada kolom note_id dan user_id terhadap notes.id dan users.id
  pgm.addConstraint('playlist_log', 'fk_playlist_log.playlist_id_playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE');
};
 
exports.down = (pgm) => {
  // menghapus tabel collaborations
  pgm.dropTable('playlist_log');
};