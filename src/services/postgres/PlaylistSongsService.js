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
    const query = {
      text: 'SELECT playlist_songs.*, playlist.name, users.username, songs.title, songs.performer FROM playlist_songs LEFT JOIN playlist ON playlist.id = playlist_songs.playlist_id LEFT JOIN songs ON songs.id = playlist_songs.songs_id LEFT JOIN users ON users.id = playlist.owner WHERE playlist_songs.playlist_id = $1',
      values: [playlist_id]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
        throw new NotFoundError('playlist. Id tidak ditemukan');
      }

    let playlist = result.rows.map(mapDBToModelPlaylist)[0];
    let songs = result.rows.map(mapDBToSongModelForList);
    playlist["songs"] = songs;
    
    return playlist;
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
