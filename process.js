var sys = require('sys'),
	http = require('http'),
	port = 6000,
	querystring = require('querystring');
	utils = require('util'),
	uuid = require('node-uuid'),
	fs = require('fs');

http.createServer(function(request, response) {
	console.log('A request hit node.');
	switch (request.url) {
		case '/linkedin-birthday-reminders/process':
			if (request.method == 'POST') {
				console.log("[200] " + request.method + " to " + request.url);
				var fullBody = '';
				var totalBirthdays = 0;
				
				request.on('data', function(chunk) { fullBody += chunk.toString(); });		
				request.on('end', function() {
					// request ended -> do something with the data
					response.writeHead(200, "OK", {'Content-Type': 'text/json'});
					
					// parse the received body data
					var decodedJSON = JSON.parse(fullBody);
					var profiles = decodedJSON.values;
					
					// output the decoded data to the HTTP response          
					
					// Receive a stream of data that represents the contacts and birthdays
					var eventsString = "BEGIN:VCALENDAR\r\n";
						eventsString += "VERSION:2.0\r\n";
						eventsString += "PRODID:-//Joshua Lyman.com//LinkedIn Birthday Reminder//EN\r\n";
						eventsString += "CALSCALE:GREGORIAN\r\n";
			
					// For each object, create the iCal file/text to represent it
					for (var i = 0; i < profiles.length; i++) {
						if (profiles[i].hasOwnProperty('dateOfBirth')) {
							if (profiles[i].dateOfBirth.hasOwnProperty('month') && profiles[i].dateOfBirth.hasOwnProperty('day')) {
								// We have enough to construct the event
								totalBirthdays++;
								
								// Add this text to a long string that represents the file.
								eventsString += "BEGIN:VEVENT\r\n";
								eventsString += "UID:" + uuid() + "\r\n";
								eventsString += "RRULE:FREQ=YEARLY;INTERVAL=1\r\n";
								eventsString += "TRANSP:TRANSPARENT\r\n";
								eventsString += "SUMMARY:" + profiles[i].firstName.replace(',','') + " " + profiles[i].lastName.replace(',','') + "'s Birthday\r\n";
								eventsString += "DTSTART;VALUE=DATE:2008" + padDate(profiles[i].dateOfBirth.month) + padDate(profiles[i].dateOfBirth.day) + "\r\n";
								eventsString += "DURATION:P1D\r\n";
								eventsString += "DESCRIPTION:Don't forget to send a message on LinkedIn!\r\n";
								eventsString += "BEGIN:VALARM\r\n";
								eventsString += "TRIGGER:-P0D\r\n";
								eventsString += "DESCRIPTION:Event reminder\r\n";
								eventsString += "ACTION:DISPLAY\r\n";
								eventsString += "END:VALARM\r\n";
								eventsString += "END:VEVENT\r\n";
							}
						}
					
					}
					
					eventsString += "END:VCALENDAR";
					
					// Write out the string to a temporary file
					var filePath = 'calfiles/linkedin-birthdays-' + uuid() + '.ics';
					fs.writeFile(filePath, eventsString, function (err) {
						if (err) throw err;
						console.log('!!! file succesfully written! !!!');
					});
					
					
					// Do cleanup, scan the directory for old files and delete any older than 1 hour.
					setTimeout(deleteFile, 1800000, filePath);
					

					// Push that file back to the requestor.
					response.end(JSON.stringify({'path': filePath, 'totalConnections': profiles.length, 'totalBirthdays': totalBirthdays}));
				});
			
			} else {
				console.log("[405] " + request.method + " to " + request.url);
				response.writeHead(405, "Method not supported", {'Content-Type': 'text/html'});
				response.end('<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
			}
			break;
		default:
			response.writeHead(404, "Not found", {'Content-Type': 'text/html'});
			response.end('<html><head><title>404 - Not found</title></head><body><h1>Not found.</h1></body></html>');
			console.log("[404] " + request.method + " to " + request.url);
	};
}).listen(port);

function padDate(num) {
	return (num < 10 ? '0' : '') + num;
}

function deleteFile(path) {
	fs.unlink(path, function (err) {
		if (err) throw err;
		console.log('!!! successfully deleted ' + path + '!!!');
	});
}

sys.puts('Server listening on port ' + port);
