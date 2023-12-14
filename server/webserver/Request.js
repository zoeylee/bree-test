import getPath from '../utils/getPath';

class Request {
  constructor(queryData, request, response, body) {
    this.queryData = queryData;
    this.request = request;
    this.response = response;
    this.body = body;
  }

  getData() {
    return this.queryData;
  }
  
  getBody() {
    return this.body;
  }

  getPath() {
    return getPath(this.request.url);
  }

  respond(data, status = 200, contentType = 'text/plain') {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Length': Buffer.byteLength(data, 'utf8'),
      'Content-Type': contentType,
    };

    this.response.writeHead(status, headers);
    this.response.end(data, 'utf8');
  }

  respondJSON(json, status = 200) {
    this.respond(json, status, 'application/json');
  }
}

module.exports = Request;
