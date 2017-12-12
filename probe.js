var pmx     = require('pmx');
var pm2     = require('pm2');
var fs      = require('fs');
var path    = require('path');
var shelljs = require('shelljs');

var conf = pmx.initModule({
  comment          : 'This module monitors PM2',
  errors           : true,
  latency          : false,
  versioning       : false,
  show_module_meta : false,
  module_type      : 'database',
  pid              : pmx.getPID(path.join(process.env.HOME, '.pm2', 'pm2.pid')),

  widget : {
    theme            : ['#111111', '#1B2228', '#807C7C', '#807C7C'],
    logo             : 'https://raw.githubusercontent.com/Unitech/pm2/master/pres/pm2-v4.png'
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

  var metric = probe.metric({
    name  : 'Processes',
    value : function() {
      return pm2_procs;
    }
  });
});

pmx.action('flush pm2 logs', { comment : 'Flush logs' } , function(reply) {
  var child = shelljs.exec('pm2 flush');
  return reply(child);
});

pmx.action('pm2 ls', { comment : 'Flush logs' } , function(reply) {
  var child = shelljs.exec('pm2 ls');
  return reply(child);
});

pmx.action('update', { comment : 'Flush logs' } , function(reply) {
  var child = shelljs.exec('pm2 update');
  return reply(child);
});

pmx.action('report', function(reply) {
  var child = shelljs.exec('pm2 report');
  return reply(child);
});

var Probe = pmx.probe();
