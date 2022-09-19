const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../api/exceptions/InvariantError');
const NotFoundError = require('../../api/exceptions/NotFoundError');
const { mapDBToSongModel, mapDBToSongModelForList } = require('../../utils');

 
class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, albumId, duration }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();

    const query = {
        text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $7, $6, $8, $8) RETURNING id',
        values: [id, title, year, genre, performer, albumId, duration, createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
        throw new InvariantError('Lagu gagal ditambahkan');
      }
  
    return result.rows[0].id;
  }

  async getSongs(title, performer) {
    let query = 'SELECT id, title, performer FROM songs'
    let values = []
    if(title){
      title = `%${title}%`
      values.push(title)
      let queryt = `lower(title) LIKE lower(\$${values.length})`
      if (values.length > 1){
        queryt = ` AND `+ queryt
      } else {
        queryt = ` WHERE `+ queryt
      }
      query += queryt
    }
    if(performer){
      performer = `%${performer}%`
      values.push(performer)
      let queryp = `lower(performer) LIKE lower(\$${values.length})`
      if (values.length > 1){
        queryp = ` AND `+ queryp
      } else {
        queryp = ` WHERE `+ queryp
      }
      query += queryp
    }
    if (values.length >= 1){
      query = {
        text: query,
        values: values
      }
    }
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToSongModelForList);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
     
    if (result.rowCount < 1) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }   
      return result.rows.map(mapDBToSongModel)[0];
  }

  async editSongById(id, { title, year, genre, performer, albumid, duration }) {
    const updatedAt = new Date().toISOString();
    let text = "UPDATE songs SET title = $2, year = $3, updated_at = $4, genre = $5, performer = $6"
    let values = [id, title, year, updatedAt, genre, performer]
    if( albumid ){
      values.push(albumid)
      text+=`,albumid = \$${values.length}`
    }
    if( duration ){
      values.push(duration)
      text+=`,duration = \$${values.length}`
    }
    text += "WHERE id = $1 RETURNING id"
    const query = {
      text: text,
      values: values,
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
