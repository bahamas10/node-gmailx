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

License
-------

MIT License
