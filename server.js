/* eslint-disable no-undef */
const app = require('express')(),
	parser = require('body-parser'),
	port = process.env.PORT || 5000,
	url = '0.0.0.0',
	JsonDB = require('node-json-db').JsonDB,
	Config = require('node-json-db/dist/lib/JsonDBConfig').Config;

var db = new JsonDB(new Config('database/comments-store', true, true, '/'));

app.use(parser.json());

app.use(parser.urlencoded({
	extended:true,
}));

app.use((_, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.get('/', (_, res) => {
	// respond to the request ping
	res.send('pong');
});

app.post('/post-comment', (req, res) => {
	let cmt = req.body.comment,
		time = req.body.time,
		name = req.body.name;
	let dataDB = db.getData('/comments'),
		len = Object.keys(dataDB).length;

	db.push('/comments/' + String(len + 1), {
		'name': name,
		'message': cmt,
		'id': len + 1,
		'upvotes': 0,
		'downvotes': 0,
		'time': time
	});
	dataDB = db.getData('/comments');
	let arr = [];
	for (let inst in dataDB) {
		arr.push(dataDB[inst]);
	}
	res.send(arr);
});

app.post('/upvote-comment', (req, res) => {
	let id = req.body.id;
	let dataDB = db.getData('/comments/' + String(id));
	dataDB['upvotes'] = parseInt(dataDB['upvotes']) + 1;
	db.push('/comments/' + String(id), dataDB);
	dataDB = db.getData('/comments');
	let arr = [];
	for (let inst in dataDB) {
		arr.push(dataDB[inst]);
	}
	res.send(arr);
});

app.post('/downvote-comment', (req, res) => {
	let id = req.body.id;
	let dataDB = db.getData('/comments/' + String(id));
	dataDB['downvotes'] = parseInt(dataDB['downvotes']) + 1;
	db.push('/comments/' + String(id), dataDB);
	dataDB = db.getData('/comments');
	let arr = [];
	for (let inst in dataDB) {
		arr.push(dataDB[inst]);
	}
	res.send(arr);
});

app.get('/comments', (req, res) => {
	let dataDB = db.getData('/comments'),
		arr = [];
	for (let inst in dataDB) {
		arr.push(dataDB[inst]);
	}
	res.send(arr);
});

const server = app.listen(port, url, err => {
	if (err) throw err;
	else   console.warn('Up and running at ', server.address().address, ' :', server.address().port);
});
