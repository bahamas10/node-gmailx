gmailx
======

send email with similar input as `mailx -t` using Google's free SMTP server

Installation
------------

    [sudo] npm install -g gmailx

Usage
-----

This tool mimics the behavior of `mailx` but doesn't require any mail pickup
programming running on the current host as it connects to Google's free
anonymous SMTP server.

NOTE: this can only send to gmail accounts!

    $ cat message.txt
    To: test@gmail.com
    Subject: hello there!

    This is a test!
    $ cat message.txt | gmailx
    message sent: 250 2.0.0 OK 1436563766 e109si12320482qgf.118 - gsmtp

If you specify a non-gmail address you will see

    $ cat message.txt | gmailx
    Can't send mail - all recipients were rejected
    $ echo $?
    1

CLI Options

    $ gmailx -h
    Usage: gmailx [-c cc] [-b bcc] [-a attachment/file] to ...

    mimic mailx but use googles free SMTP server for Gmail

    options
      -a, --attachment <path>  filename to send as an attachment
      -b, --bcc <addr>         address to bcc to
      -c, --cc <addr>          address to cc to
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
