import fastify from 'fastify';
import * as libxml from 'libxmljs';

import { Gin } from './routes/v1/gin';

const APP = fastify();
const PORT = 3080;

APP.addContentTypeParser(['text/xml', 'application/xml'], function (req, done) {
	let body = ''
	req.on('data', function (data) {
		body += data
	})
	req.on('end', function () {
		try {
			const xmlDoc: libxml.Document = libxml.parseXmlString(body, {noblanks: true})
			done(null, xmlDoc);
		} catch (err) {
			done(err);
		}
	})
	req.on('error', done);
});

APP.register(Gin.ginRoute, { prefix: '/v1' });

APP.listen(PORT).then(() => {
	console.log(`Server running at http://localhost:${PORT}/`);
});