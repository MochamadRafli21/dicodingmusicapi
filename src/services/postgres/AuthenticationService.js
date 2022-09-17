const { Pool } = require('pg');
const InvariantError = require('../../api/exceptions/InvariantError');

class AuthService {
    constructor(){
        this._pool = new Pool();
    }

    async addRefreshToken(token){
        const query = {
            text: 'INSERT INTO authentications VALUES($1)',
            values: [token],
          };
       
          await this._pool.query(query);
    }

    async verifyRefreshToken(token){
        const query = {
            text: 'SELECT * FROM authentications WHERE token = $1',
            values: [token],
          };
       
        const result = await this._pool.query(query);

        if(!result.rowCount){
            throw new InvariantError("token tidak valid, silahkan login kembali")
        }
    }

    async deleteRefreshToken(token){
        const query = {
            text: 'DELETE FROM authentications WHERE token = $1',
            values: [token]
        }
        await this._pool.query(query);
    }
}

module.exports= AuthService