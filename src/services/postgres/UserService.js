const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt')
const InvariantError = require('../../api/exceptions/InvariantError');
const AuthenticationError = require('../../api/exceptions/AuthenticationsError');

 
class UserService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
      // verifikasi jika user dengan username yang sama telah digunakan
      await this.verifyUsername(username)
      // bila verifikasi berhasil maka buat user baru
      const id = `user-${nanoid(16)}`;
      const hashPassword = await bcrypt.hash(password, 10)

    const query = {
        text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, password',
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
  
  async verifyUserCredentials(username, password){

    const query = {
      text: "SELECT id, password FROM users WHERE lower(username) = lower($1)",
      values: [username]
    }

    
    const result = await this._pool.query(query)
    console.log(result)
    
    if(!result.rowCount){
      throw new AuthenticationError("Username atau password salah!")
    }

    const {id, password:hashPassword} = result.rows[0];
    const match = await bcrypt.compare(password, hashPassword)

    if(!match){
      throw new AuthenticationError("Username atau password salah!")
    }

    return id;
    
  }

}

module.exports = UserService;
