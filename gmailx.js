#!/usr/bin/env node
/**
 * send email with similar input as `mailx -t` using Google's
 * free SMTP server
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * Date: July 10, 2015
 * License: MIT
 */

var f = require('util').format;
var fs = require('fs');
var os = require('os');

var nodemailer = require('nodemailer');
var strsplit = require('strsplit');

var input = fs.readFileSync('/dev/stdin', 'utf8');

// extract headers
var i = input.indexOf('\n\n');
if (i < 0) {
  console.error('bad input');
  process.exit(1);
}

var headers = {};
input.substr(0, i).split('\n').forEach(function(l) {
  var s = strsplit(l, ': ', 2);
  headers[s[0]] = s[1];
});

// the rest is body
var body = input.substr(i + 2);

// create the emailer
var transporter = nodemailer.createTransport({
  host: 'aspmx.l.google.com',
  port: 25,
  //secure: true
});

var opts = {
  from: headers.From || f('%s@%s', process.env.USER, os.hostname()),
  to: headers.To,
  replyTo: headers['Reply-To'],
  subject: headers.Subject
};

if (!opts.to) {
  console.error('to address must be specified');
  process.exit(1);
}

var ct = headers['Content-Type'];
if (ct && ct.indexOf('text/html') === 0)
  opts.html = body;
else
  opts.text = body;

transporter.sendMail(opts, function(err, info) {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
  console.log('message sent: %s', info.response);
});
