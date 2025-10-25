const http = require('http');
const fs = require('fs').promises;
const { program } = require('commander');
const { XMLBuilder } = require('fast-xml-parser');

program
  .option('-i, --input <type>', 'шлях до файлу для читання')
  .option('-h, --host <type>', 'адреса сервера')
  .option('-p, --port <type>', 'порт сервера');

program.parse(process.argv);
const options = program.opts();

if (!options.input || !options.host || !options.port) {
  console.error('Помилка: не вказано обов\'язкові параметри.');
  process.exit(1);
}

const server = http.createServer(async (req, res) => {
  // ... логіка обробки запитів буде тут ...
});

server.listen(options.port, options.host, () => {
  console.log(`Сервер запущено на http://${options.host}:${options.port}`);
});