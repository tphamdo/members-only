"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const SQL = `
  CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(255) NOT NULL,
  hash VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  member BOOLEAN NOT NULL DEFAULT false,
  admin BOOLEAN NOT NULL DEFAULT false);

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    message VARCHAR(255) NOT NULL,
    fromUserId INTEGER NOT NULL,
    added TIMESTAMP NOT NULL
  );
`;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const args = process.argv.slice(2);
        if (args.length !== 1) {
            console.error('Expected to recieve 1 argument <database_connection_url>');
            return -1;
        }
        const client = new pg_1.Client({
            connectionString: args[0],
        });
        try {
            yield client.connect();
            const result = yield client.query(SQL);
            console.debug(result);
        }
        catch (error) {
            throw Error('Could not init users table: ' + error);
        }
        finally {
            yield client.end();
        }
    });
}
main();
