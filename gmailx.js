#!/usr/bin/env node
/**
 * send email with similar input as `mailx` using Google's
 * free SMTP server
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * Date: July 10, 2015
 * License: MIT
 */

var f = require('util').format;
var fs = require('fs');
var os = require('os');

var getopt = require('posix-getopt');
var nodemailer = require('nodemailer');
var strsplit = require('strsplit');

var package = require('./package.json');

var USAGE = [
  'Usage: gmailx [-c cc] [-b bcc] [-a attachment/file] to ...',
  '',
  'mimic mailx but use googles free SMTP server for Gmail',
  '',
  'options',
  '  -a, --attachment <path>  filename to send as an attachment',
  '  -b, --bcc <addr>         address to bcc to',
  '  -c, --cc <addr>          address to cc to',
  '  -d, --debug              turn on debugging information',
  '  -h, --help               print this message and exit',
  '  -r, --from <addr>        address to email from',
  '  -s, --subject <line>     subject line to use',
  '  -S, --header <foo=bar>   a raw header to specify',
  '  -t, --raw-mode           specify To:, From:, Reply-To:, etc. over stdin',
  '  -u, --updates            check for available updates',
  '  -v, --version            print the version number and exit',
].join('\n');

function debug() {}

// command line arguments
var options = [
  'a:(attachment)',
  'b:(bcc)',
  'c:(cc)',
  'd(debug)',
  'h(help)',
  'r:(from)',
  's:(subject)',
  'S:(header)',
  't(raw-mode)',
  'u(updates)',
  'v(version)'
].join('');
var parser = new getopt.BasicParser(options, process.argv);

var headers = {};
var opts = {
  attachments: [],
  bcc: [],
  cc: [],
  to: [],
  from: [],
};
var rawmode = false;
var option;
while ((option = parser.getopt())) {
  switch (option.option) {
    case 'a': opts.attachments.push({path: option.optarg}); break;
    case 'b': opts.bcc.push(option.optarg); break;
    case 'c': opts.cc.push(option.optarg); break;
    case 'd': debug = console.error; break;
    case 'h': console.log(USAGE); process.exit(0);
    case 'r': opts.from.push(option.optarg); break;
    case 's': opts.subject = option.optarg; break;
    case 'S':
      var s = strsplit(option.optarg, '=', 2);
      var key = s[0].toLowerCase();
      var value = s[1];
      headers[key] = value;
      break;
    case 't': rawmode = true; break;
    case 'u': // check for updates
      require('latest').checkupdate(package, function(ret, msg) {
        console.log(msg);
        process.exit(ret);
      });
      return;
    case 'v': console.log(package.version); process.exit(0);
    default: console.error(USAGE); process.exit(1); break;
  }
}
if (!rawmode)
  opts.to = opts.to.concat(process.argv.slice(parser.optind()));

var input = fs.readFileSync('/dev/stdin', 'utf8');

var body;
if (rawmode) {
  // extract headers if in raw mode
  var i = input.indexOf('\n\n');
  if (i < 0) {
    console.error('bad input');
    process.exit(1);
  }

  input.substr(0, i).split('\n').forEach(function(l) {
    var s = strsplit(l, ': ', 2);
    var key = s[0].toLowerCase();
    var value = s[1];
    headers[key] = value;
  });

  debug('extracted raw headers');
  debug(headers);

  // the rest is body
  body = input.substr(i + 2);
} else {
  body = input;
}

// create the emailer
var transporter = nodemailer.createTransport({
  host: 'aspmx.l.google.com',
  port: 25,
  //secure: true
});

if (headers.from)
  opts.from.push(headers.from);
if (opts.from.length === 0)
  opts.from.push(f('%s@%s', process.env.USER, os.hostname()));

if (headers.to)
  opts.to.push(headers.to);

if (headers['reply-to'])
  opts.replyTo = headers['reply-to'];

opts.subject = opts.subject || headers.subject;

if (opts.to.length === 0) {
  console.error('to address must be specified');
  process.exit(1);
}

var ct = headers['content-type'];
if (ct && ct.indexOf('text/html') === 0)
  opts.html = body;
else
  opts.text = body;

debug(opts);

transporter.sendMail(opts, function(err, info) {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
  console.log('message sent: %s', info.response);
});
