const ds18b20 = require('ds18b20');
const Influx = require('influxdb-nodejs');


const sensorId = '';
const influxdb_host = '10.0.0.10';
const influxdb_database = 'temperatures';

const program = require('commander');

program
  .version('0.0.1')
  .option('-t, --host [value]', 'InfluxDB host [localhost]', 'localhost')
  .option('-d, --database [value]', 'InfluxDB database, [temperatures]', 'temperatures')
  .option('-r, --room [value]', 'Room name [my room]', 'my room')
  .option('-s, --sensorid [value]', 'Sensor id')
  .parse(process.argv);

console.log('Host: ' + program.host);
console.log('Database: ' + program.database);
console.log('Room: ' + program.room);
console.log('Sensor id: ' + program.sensorid);

if (!program.sensorid || program.sensorid.length < 1) {
    console.log('Missing value for sensor id');
    process.exit(1);
}

const client = new Influx(`http://${program.host}:8086/${program.database}`);

// ... async call
ds18b20.temperature('10-00080283a977', function(err, temp) {
    if (err) {
        console.log(err);
        process.exit(1);
    } else {
        client.write(program.database)
          .tag({
            room: program.room
          })
          .field({
            value: temp
          })
          .then(() => console.info('write point success'))
          .catch(console.error);
    }
});


