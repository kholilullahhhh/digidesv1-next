// Menjalankan PostgreSQL lokal (embedded-postgres) untuk development.
// Pakai:  node scripts/dev-db.mjs
// Berhenti: Ctrl+C (data disimpan di .data/postgres).
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import EmbeddedPostgres from 'embedded-postgres';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', '.data', 'postgres');
const PORT = Number(process.env.PGPORT || 5432);
const USER = process.env.PGUSER || 'postgres';
const PASSWORD = process.env.PGPASSWORD || 'password';
const DATABASE = process.env.PGDATABASE || 'digides';

function isListening(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: '127.0.0.1' });
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
  });
}

async function main() {
  if (await isListening(PORT)) {
    console.log(`[dev-db] Port ${PORT} sudah terbuka — diasumsikan PostgreSQL berjalan. Tidak diubah.`);
    return;
  }

  const pg = new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    user: USER,
    password: PASSWORD,
    port: PORT,
    persistent: true,
    onLog: () => {},
  });

  if (!fs.existsSync(path.join(DATA_DIR, 'PG_VERSION'))) {
    console.log('[dev-db] Inisialisasi data directory ...');
    await pg.initialise();
  }

  console.log('[dev-db] Menjalankan PostgreSQL ...');
  await pg.start();

  try {
    await pg.createDatabase(DATABASE);
    console.log(`[dev-db] Database "${DATABASE}" dibuat.`);
  } catch {
    console.log(`[dev-db] Database "${DATABASE}" sudah ada.`);
  }

  console.log(`[dev-db] Siap -> postgresql://${USER}:${PASSWORD}@localhost:${PORT}/${DATABASE}`);

  const stop = async () => {
    try {
      await pg.stop();
    } catch {
      /* already stopped */
    }
    process.exit(0);
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);

  // Tetap hidup agar server postgres ikut hidup.
  setInterval(() => {}, 1 << 30);
}

main().catch((err) => {
  console.error('[dev-db] Gagal:', err);
  process.exit(1);
});
