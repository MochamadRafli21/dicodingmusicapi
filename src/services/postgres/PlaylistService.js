const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../api/exceptions/InvariantError');
const NotFoundError = require('../../api/exceptions/NotFoundError');
const AuthorizationError = require('../../api/exceptions/AuthorizationsError');
const {mapDBToModelPlaylist} = require('../../utils')

 
class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyPlaylistOwner(id, owner){
    const query = {
        text: 'SELECT * FROM playlist WHERE id = $1',
        values: [id],
      };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
        throw new NotFoundError('Playlist tidak ditemukan');
      }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
        throw new AuthorizationError('Anda tidak memiliki hak akses');
      }
  }

  async addPlaylist(name, owner ) {
    const id = nanoid(16);

    const query = {
        text: 'INSERT INTO playlist VALUES($1, $2, $3) RETURNING id',
        values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
        throw new InvariantError('Playlist gagal ditambahkan');
      }
  
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
        text:'SELECT id,name,owner FROM playlist WHERE owner = $1',
        values:[owner]
    }

    const result = await this._pool.query(query);

    const userQ = {
      text:'SELECT username FROM users WHERE id = $1',
      values:[owner]
    }

    const result2 = await this._pool.query(userQ);
    let final = result.rows.map(mapDBToModelPlaylist)
    final = final.map(res => {
      return {
        id:res.id,
        name: res.name,
        username: result2.rows[0].username
      }
      })
  

    return final;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlist WHERE id = $1 RETURNING id',
      values: [id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = PlaylistService;
