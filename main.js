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
  try {
    const data = await fs.readFile(options.input, 'utf8');
    const mtcars = JSON.parse(data);
    const url = new URL(req.url, `http://${options.host}:${options.port}`);
    const cylinders = url.searchParams.get('cylinders');
    const max_mpg = url.searchParams.get('max_mpg');

    let filteredCars = mtcars;

    if (max_mpg) {
      filteredCars = filteredCars.filter(car => car.mpg < parseFloat(max_mpg));
    }

    const result = filteredCars.map(car => {
      const carData = { model: car.model };
      if (cylinders === 'true') {
        carData.cyl = car.cyl;
      }
      carData.mpg = car.mpg;
      return { car: carData };
    });

    const builder = new XMLBuilder({
        format: true,
        arrayNodeName: "cars",
        suppressEmptyNode: true,
    });
    const xmlContent = builder.build({ cars: { car: result.map(item => item.car) } });


    res.writeHead(200, { 'Content-Type': 'application/xml' });
    res.end(xmlContent);

  } catch (error) {
    if (error.code === 'ENOENT') {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Cannot find input file');
    } else {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Внутрішня помилка сервера');
    }
  }
});

server.listen(options.port, options.host, () => {
  console.log(`Сервер запущено на http://${options.host}:${options.port}`);
});