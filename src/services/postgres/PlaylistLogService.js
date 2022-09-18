const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../api/exceptions/InvariantError');
const { mapDBToModelActivity } = require('../../utils')
 
class PlaylistLogService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addPlaylistLog(playlist_id, songs_id, user_id, action ) {
    const time = new Date().toISOString();
    const id = nanoid(16);

    const query = {
        text: 'INSERT INTO playlist_log VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
        values: [id, playlist_id, songs_id, user_id, time, action],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
        throw new InvariantError('Playlist gagal ditambahkan');
      }
  
    return result.rows[0].id;
  }

  async getPlaylistsLog(playlist_id) {
    const query = {
        text:'SELECT playlist_log.*, playlist.name AS playlist_name , users.username , songs.title FROM playlist_log LEFT JOIN playlist ON playlist.id = playlist_log.playlist_id LEFT JOIN users ON users.id = playlist_log.user_id LEFT JOIN songs ON songs.id = playlist_log.songs_id WHERE playlist_id = $1',
        values:[playlist_id]
    }

    const result = await this._pool.query(query);

    const activity = result.rows.map(mapDBToModelActivity)

    return {
        playlistId: playlist_id,
        activities: activity
    };
  }

}

module.exports = PlaylistLogService;
