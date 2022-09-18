const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../api/exceptions/InvariantError');
const NotFoundError = require('../../api/exceptions/NotFoundError');
const {mapDBToModelPlaylist, mapDBToSongModelForList} = require('../../utils')

class PlaylistSongsService {
  constructor(playlistLogService) {
    this._pool = new Pool();
    this._playlistLogService = playlistLogService;

  }

  async addPlaylistSongs(playlist_id, songs_id, user_id) {
    const id = nanoid(16);

    const query = {
        text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
        values: [id, playlist_id, songs_id],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
        throw new InvariantError('Lagu gagal ditambahkan ke playlist');
      }
    
    await this._playlistLogService.addPlaylistLog(playlist_id, songs_id, user_id, "add");
  
    return result.rows[0].id;
  }

  async getPlaylistSongs(playlist_id) {
    const queryP = {
        text: 'SELECT * FROM playlist WHERE id = $1',
        values: [playlist_id]
    }

    const resultP = await this._pool.query(queryP)

    if (!resultP.rowCount) {
        throw new NotFoundError('playlist. Id tidak ditemukan');
      }
    const owner = resultP.rows[0].owner
    const userQ = {
    text:'SELECT username FROM users WHERE id = $1',
    values:[owner]
    }
  
    const resultU = await this._pool.query(userQ);
    let final = resultP.rows.map(mapDBToModelPlaylist)
    
    const query = {
      text: 'SELECT * FROM playlist_songs WHERE playlist_id = $1',
      values: [playlist_id],
    };
 
    const result = await this._pool.query(query);

  let songs = []
  for(let i = 0; i < result.rowCount; i++){
    const res = result.rows[i]
      const queryS = {
          text: 'SELECT * FROM songs WHERE id = $1',
          values: [res.songs_id]
      }

      const resultS = await this._pool.query(queryS)

      songs.push(resultS.rows.map(mapDBToSongModelForList)[0]) 
  }

    final = final.map(res => {
        return {
          id:res.id,
          name: res.name,
          username: resultU.rows[0].username,
          songs: songs
        }
    })
  
    return final[0];
 
  }

  async deletePlaylistSongs(playlist_id, songs_id, user_id) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND songs_id = $2 RETURNING id',
      values: [playlist_id,songs_id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rowCount) {
      throw new NotFoundError('lagu gagal dihapus dari playlist. Id tidak ditemukan');
    }

    await this._playlistLogService.addPlaylistLog(playlist_id, songs_id, user_id, "delete");
  }
}

module.exports = PlaylistSongsService;
