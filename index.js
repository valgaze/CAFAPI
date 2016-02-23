var express = require('express');
var app = express();

var request = require('request');
var cheerio = require('cheerio');

app.get('/', function(req, res) {
  res.sendFile('./consume.html', {"root": __dirname})
});

var port = process.env.PORT || 3000
app.listen(port, function () {
  console.log('Testing 123, we are live!');
});

var lookupHash = {
	"SJC11":{"code":4021,"menu":12183,"label":"Artisan"},
	"SJCJ":{"code":4017,"menu":12738,"label":"Eat at Bridges"},
	"SJC03":{"code":4020,"menu":12471,"label":"Eat at Lakeview"},
	"SJCQ":{"code":4015,"menu":13324,"label":"Green Bar"},
	"SJCD":{"code":4018,"menu":12744,"label":"Market 170"},
	"MR2":{"code":4011,"menu":12180,"label":"Milpa 3 Fresh"},
	"SJC30":{"code":4013,"menu":12189,"label":"Social Roast"},
	"SJC17":{"code":4014,"menu":13076,"label":"The Food Foundry"},
	"SJC21":{"code":4012,"menu":12163,"label":"The Quarter"}
};

app.get('/cafes', function(req, res){
	res.send(Object.keys(lookupHash))
});

app.get('/:id', function(req, res) {
	var queryID = req.params.id;
	queryID = queryID ? queryID.toUpperCase() : queryID;

	if (lookupHash[queryID] == undefined){
		var errorObj = {Error:"Invalid cafe code. Use any of the following:" + Object.keys(lookupHash)}
		return res.send(errorObj)
	}

	var queryObj = lookupHash[queryID];
		var loc_id = queryObj.code;
		var menu_id = queryObj.menu;
		var label = queryObj.label;
	var url = `http://www.aramarkcafe.com/components/menu_weekly_alternate.aspx?locationid=${loc_id}&pageid=20&menuid=${menu_id}`;

	request(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var outputObject = {};

      var columns = $('.column');

      columns.each(function(i, element){

      	var theDay = $(this).find('.header').text().trim();
      	outputObject[theDay] = {};

      	var theContent = $(this).find('p');
      		theContent.each(function(j, element){
      			var subHeading = $(this).find('.subhead').text().trim();

      			var content = $(this).text().trim().replace( /[\s\n\r]+/g, ' ' );
      			outputObject[theDay][subHeading] = content;
      		});
      });
			outputObject['cafename'] = label;
      res.send(outputObject);
    }
  });
});
