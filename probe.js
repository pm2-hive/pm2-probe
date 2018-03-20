var pmx     = require('pmx');
var pm2     = require('pm2');
var fs      = require('fs');
var path    = require('path');
const exec = require('child_process').exec;

pmx.initModule({
  pid: pmx.getPID(path.join(process.env.HOME, '.pm2', 'pm2.pid')),
  widget : {
    type: 'generic',
    theme: ['#1d3b4a', '#1B2228', '#22bbe2', '#22bbe2'],
    logo: 'https://raw.githubusercontent.com/Unitech/pm2/master/pres/pm2-v4.png',

    el : {
      probes  : false,
      actions : true
    },

    block : {
      errors           : true,
      main_probes : ['Processes'],
      latency          : false,
      versioning       : false,
      show_module_meta : false
    }
  }
});

var probe = pmx.probe();

var pm2_procs = 0;

pm2.connect(function() {
  setInterval(function() {
    pm2.list(function(err, procs) {
      pm2_procs = procs.length;
    });
  }, 2000);

  probe.metric({
    name  : 'Processes',
    value : function() {
      return pm2_procs;
    }
  });

  var pm2_instances = probe.metric({name  : 'PM2 Instances Running'});

  setInterval(function() {
    exec('pgrep PM2', (err, stdout, stderr) => {
      if (err || stderr) {
        pm2_instances = 'N/A'
        return;
      }

      var nb = stdout.split('\n')
      nb.splice(-1, 1)
      pm2_instances = nb.length;
    });
  }, 2000)
});

pmx.action('flush pm2 logs', { comment : 'Flush logs' } , function(reply) {
  var child = shelljs.exec('pm2 flush');
  return reply(child);
});

pmx.action('pm2 ls', { comment : 'Flush logs' } , function(reply) {
  var child = shelljs.exec('pm2 ls');
  return reply(child);
});

pmx.action('report', function(reply) {
  var child = shelljs.exec('pm2 report');
  return reply(child);
});
