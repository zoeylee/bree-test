import http from 'http';
import url from 'url';
import Request from './Request';
import config from '../Config';

class HTTPServer {
  constructor(config) {
    this.config = config;
    this.server = null;
  }

  start() {
    this.server = http.createServer(this.requestHandler.bind(this));
    this.server.listen(8009, () => console.log('Server is running on port 8009'));
  }

  async stop() {
    await this.server.close();
  }

  async requestHandler(httpRequest, response) {
    this.setCORSHeaders(response);

    if (httpRequest.method === 'OPTIONS') {
      response.writeHead(204);
      response.end();
      return;
    }

    if (httpRequest.method === 'POST') {
      this.handlePostRequest(httpRequest, response);
    } else {
      response.writeHead(405, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: 'Method not allowed' }));
    }
  }

  setCORSHeaders(response) {
    response.setHeader('Access-Control-Allow-Origin', config.Access_Control_Allow_Origin);
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    response.setHeader('Access-Control-Allow-Credentials', true);
  }

  handlePostRequest(httpRequest, response) {
    let body = '';

    httpRequest.on('data', chunk => body += chunk.toString());
    httpRequest.on('end', () => this.parseRequestBody(body, httpRequest, response));
  }

  async parseRequestBody(body, httpRequest, response) {
    try {
      const parsedBody = JSON.parse(body);
      await this.processRequest(httpRequest, response, parsedBody);
    } catch (error) {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  }

  async processRequest(httpRequest, response, body) {
    const queryData = url.parse(httpRequest.url, true).query;
    const request = new Request(queryData, httpRequest, response, body);
    const path = request.getPath();
    const endpoint = this.config.endpoints[path];

    if (!endpoint) {
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: 'Endpoint not found' }));
      return;
    }
    
    endpoint.respond(request);
  }
}

module.exports = HTTPServer;
