/* eslint-disable camelcase */


exports.up = pgm => {
    pgm.addConstraint('songs', 'fk_songs.albums_id_albums.id', 'FOREIGN KEY(albumid) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropConstraint('songs', 'fk_songs.albums_id_albums.id');
};
