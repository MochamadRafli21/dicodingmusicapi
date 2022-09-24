/* eslint-disable camelcase */


exports.up = pgm => {
    pgm.addColumns('albums', {cover_url: 'TEXT'});
};

exports.down = pgm => {
    pgm.dropColumns('albums',["cover_url"], {cascade:true});
};
