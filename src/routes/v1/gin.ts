import { Builder } from 'xml2js';
import * as libxml from 'libxmljs';

export module Gin {
	let lastGinnedXmlDoc: string;
	export function ginRoute (fastify, opts, done) {
		fastify.post('/gin', processXmlFile);
		fastify.get('/gin', retrieveLastXmlFile);
		done();
	}

	function retrieveLastXmlFile(request, reply) {
		reply.status(202);
		reply.header('Content-type', 'text/xml');
		reply.send(lastGinnedXmlDoc);
	}

	async function processXmlFile(request, reply) {
		const builder = new Builder({renderOpts: { 'pretty': false}, cdata: true});
		let xmlDoc: libxml.Document = request.body;
		
		xmlDoc = await processPathNodes(xmlDoc);

		lastGinnedXmlDoc = xmlDoc.toString(false).replace(/"/gi, "'").replace(/\n/gi, "")

		reply.status(202);
		reply.header('Content-type', 'text/xml');
		reply.send(xmlDoc.toString(false).replace(/"/gi, "'").replace(/\n/gi, ""));
	}

	function processPathNodes(xmlDoc: libxml.Document) {
		const paths = xmlDoc.find("//*[name()='path']");
		const root = xmlDoc.get("/*[name()='svg']");

		let mergedPath = paths.map( path => path.attr('d').value()).join(' ');

		paths.forEach( path => path.remove());
		removeEmptyNodes(root);

		const newPathNode: libxml.Element = root.node('path');
		newPathNode.attr({'d': mergedPath});

		return xmlDoc;
	}

	function removeEmptyNodes(parent: libxml.Element) {
		const emptyNodes = parent.find("//*[name()='g' and not(*)]");
		console.log("emptyNodes", emptyNodes);
		emptyNodes.forEach( node => node.remove());
	}
}

