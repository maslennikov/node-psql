const spawn = require('child_process').spawn;


module.exports = function(options={}) {
  if (!options.database) throw new Error('No database provided')

  return fromFile(options)
}

function fromFile(options) {
  if (!options.filename) throw new Error('No sql filename provided')

  return run(options, ['-f', options.filename])
}

function run(options, args=[]) {
  return new Promise((ok, nok) => {
    const psql = spawn('psql', args.concat(options.database))
    psql.stdout.on('data', data => console.log(data.toString()));
    psql.stderr.on('data', data => console.error(data.toString()));
    psql.on('close', code => {
      return code === 0
        ? ok()
        : nok(new Error(`Child process exited with code ${code}`))
    });
    psql.on('error', err => {
      console.log('Failed to execute child process:\n', err);
      return nok(err)
    });
  })
}
