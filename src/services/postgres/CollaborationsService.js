const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../api/exceptions/InvariantError');
const NotFoundError = require('../../api/exceptions/NotFoundError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(playlist_id, user_id ) {
    const id = nanoid(16);

    const queryS = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [user_id],
    };

    const resultS = await this._pool.query(queryS)
    if (!resultS.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }


    const query = {
        text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
        values: [id, playlist_id, user_id],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
        throw new InvariantError('user gagal ditambahkan ke playlist');
      }
  
    return result.rows[0].id;
  }

  async deleteCollaboration(playlist_id, user_id) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlist_id,user_id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rowCount) {
      throw new NotFoundError('user gagal dihapus dari playlist. Id tidak ditemukan');
    }
  }

  async verifyCollaborations(playlist_id, user_id){
    const query = {
        text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
        values: [playlist_id,user_id],
      };
   
      const result = await this._pool.query(query);
   
      if (!result.rowCount) {
        throw new NotFoundError('user tidak ditemukan di playlist. Id tidak ditemukan');
      }
  }
}

module.exports = CollaborationsService;
