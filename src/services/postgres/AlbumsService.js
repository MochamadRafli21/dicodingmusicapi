const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../api/exceptions/InvariantError');
const NotFoundError = require('../../api/exceptions/NotFoundError');
const { mapDBToModel,mapDBToSongModelForList } = require('../../utils');

 
class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
        text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
        values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
        throw new InvariantError('Album gagal ditambahkan');
      }
  
    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(mapDBToModel);
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const songsQuery = {
      text: 'SELECT * FROM songs WHERE albumid = $1',
      values:[id]
    }
    const songsresult = await this._pool.query(songsQuery)
    const result = await this._pool.query(query);
    
    if (result.rows.length < 1) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    
    let albumRes = result.rows.map(mapDBToModel)[0];
    let songs = songsresult.rows.map(mapDBToSongModelForList);
    albumRes["songs"] = songs;
    
    return albumRes;
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $2, year = $3, updated_at = $4 WHERE id = $1 RETURNING id',
      values: [id, name, year, updatedAt],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
