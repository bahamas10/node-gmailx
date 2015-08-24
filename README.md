gmailx
======

Send email easily on the command line without running a server

Installation
------------

    [sudo] npm install -g gmailx

Usage
-----

This tool mimics the behavior of `mailx` but doesn't require any mail pickup
programming running on the current host as it connects (by default) to Google's
free anonymous SMTP server.

NOTE: by default, this can only send to gmail accounts!

    $ cat message.txt
    To: test@gmail.com
    Subject: hello there!

    This is a test!
    $ cat message.txt | gmailx -t
    message sent: 250 2.0.0 OK 1436563766 e109si12320482qgf.118 - gsmtp

If you specify a non-gmail address you will see

    $ cat message.txt | gmailx -t
    Can't send mail - all recipients were rejected
    $ echo $?
    1

You can alternatively construct everything on the command line, ie.

    gmailx -a foo.pdf -S 'your document' -Sreply-to=foo@bar.com recipient@example.com <<-EOF
    Attached is your pdf
    EOF

And, optionally, specify an alternate server or authorization to use

    $ cat config.json
    {
      "service": "gmail",
      "auth": {
        "user": "sender@gmail.com",
        "pass": "password"
      }
    }
    $ echo hi | gmailx -C config.json -s 'subject' recipient@example.com

See [nodemailer](https://github.com/andris9/Nodemailer#use-direct-transport)
for what can be specified in the config file

CLI Options

    $ gmailx -h
    Usage: gmailx [-c cc] [-b bcc] [-a attachment/file] to ...

    Send email easily on the command line without running a server

    options
      -a, --attachment <path>  filename to send as an attachment
      -b, --bcc <addr>         address to bcc to
      -c, --cc <addr>          address to cc to
      -C, --config <config>    JSON file to be passed to nodemailer.createTransport
      -d, --debug              turn on debugging information
      -h, --help               print this message and exit
      -r, --from <addr>        address to email from
      -s, --subject <line>     subject line to use
      -S, --header <foo=bar>   a raw header to specify
      -t, --raw-mode           specify To:, From:, Reply-To:, etc. over stdin
      -u, --updates            check for available updates
      -v, --version            print the version number and exit

License
-------

MIT License
