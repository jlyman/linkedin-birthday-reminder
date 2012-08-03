LinkedIn Birthday Reminder App
================================

One fine weekend I needed a little project to keep me busy, and I wanted to experiment with Node.js. A few hours later this little one-pager was born! It's purpose is very simple: by integrating with the LinkedIn API, it will pull a list of your contacts, find birthdays for those who have them listed, and construct a .ICS file that can be imported into iCal/Calendar (OS X), Outlook, etc.

See it in action at http://www.joshualyman.com/linkedin-birthday-reminders/.

By no means is this a full and complete demonstration of Node.js, good Javascript packages, or anything really. It's just a quick and simple mini-app I wrote to teach myself some concepts, and hope that it might help you out too. Enjoy!

Running it yourself
-------------------------

Want to run it on your own server? Here is a little guidance for getting it up and running.

1. You will need a LinkedIn Developer API key, which can be obtained by signing up at https://developer.linkedin.com/
2. Once you have your API key, fill it in on line 23 in index.html.
3. Upload everything onto your server which has a Node.js instance running on it, and run process.js (`node process.js`)
4. The process.js file requires the excellent UUID script customized for Node (from https://github.com/broofa/node-uuid). I can't remember if you need to use NPM to install it, or if you can just get by with the files included in the same directory as I have it right now.
5. You'll want to make the calfiles directory writeable by the server. Steps to do this will depend on your server setup. The generated .ICS files are stored here temporarily for the user to download, and the process.js script cleans them up every so often. (LinkedIn API TOS states that you can't store user information long term.)
6. You'll need to modify the node.htaccess file to represent the server's domain name, port that Node.js is listening on, file path, etc., in order to get requests routed correctly to Node. Modify the appropriate lines in the file and then rename it to .htaccess if you are running Apache.

There may be other steps that I have forgotten to include here, but it's a fairly simple script, so hopefully you'll be able to get it up and running without too much difficulty. Leave a comment otherwise.