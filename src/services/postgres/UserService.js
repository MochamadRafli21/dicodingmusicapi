const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt')
const InvariantError = require('../../api/exceptions/InvariantError');

 
class UserService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
      // verifikasi jika user dengan username yang sama telah digunakan
      await this.verifyUsername(username)
      // bila verifikasi berhasil maka buat user baru
      const id = `user-${nanoid(16)}`;
      const hashPassword = bcrypt.hash(password, 10)

    const query = {
        text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
        values: [id, username, hashPassword, fullname],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
        throw new InvariantError('Akun gagal ditambahkan');
      }
  
    return result.rows[0].id;
  }

  async verifyUsername(username){
    const query = {
        text: "SELECT * FROM users WHERE username = $1",
        values: [username]
    }
    const result = await this._pool.query(query)

    if (result.rows.length > 0) {
        throw new InvariantError('Gagal menambahkan user. Username telah digunakan.')
      }  
    }

}

module.exports = UserService;
