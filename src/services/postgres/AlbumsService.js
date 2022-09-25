const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../api/exceptions/InvariantError');
const NotFoundError = require('../../api/exceptions/NotFoundError');
const { mapDBToModel,mapDBToSongModelForList } = require('../../utils');

 
class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
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
      text: 'SELECT songs.*, albums.* FROM albums LEFT JOIN songs ON albums.id = songs.albumid WHERE albums.id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (result.rowCount < 1) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    
    let albumRes = result.rows.map(mapDBToModel)[0];
    let songs = result.rows.map(mapDBToSongModelForList);
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
 
    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async editAlbumCoverById(id, url) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET cover_url = $2, updated_at = $3 WHERE id = $1 RETURNING id',
      values: [id, url, updatedAt],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async addAlbumsLike(albums_id, users_id){
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_album_likes.album_id = $1 AND user_album_likes.user_id = $2 ',
      values: [albums_id, users_id]
    }

    const exist = await this._pool.query(query)
    if (exist.rowCount === 0){
      const id = nanoid(16);
      const postQuery = {
        text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
        values: [id, users_id, albums_id]
      }
      const result = await this._pool.query(postQuery);

      if (!result.rows[0].id) {
          throw new InvariantError('Album gagal ditambahkan');
        }
      await this._cacheService.delete(`albumsLike:${albums_id}`);
      } else {
      const query = {
        text: 'DELETE FROM user_album_likes WHERE id = $1 RETURNING id',
        values: [exist.rows[0].id],
      };
   
      const result = await this._pool.query(query);
   
      if (!result.rowCount) {
        throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
      }

      await this._cacheService.delete(`albumsLike:${albums_id}`);
    }
  }

  async getAlbumsLike(albums_id){
    try {
      const result = await this._cacheService.get(`albumsLike:${albums_id}`);
      return {
        rowCount: parseInt(result),
        is_cache: true,
      };
    } catch (error) {     
      const query = {
        text: 'SELECT * FROM user_album_likes WHERE user_album_likes.album_id = $1',
        values: [albums_id]
      }
      const result = await this._pool.query(query);
      result.is_cache = false
      await this._cacheService.set(`albumsLike:${albums_id}`, result.rowCount);
      return result
    }
  }
}

module.exports = AlbumsService;
