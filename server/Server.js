import CheckSDNEndpoint from './endpoints/CheckSDNEndpoint';
import HTTPServer from './webserver/HTTPServer';

const httpServer = new HTTPServer({
  endpoints: {
    '/api/post/check-sdn': CheckSDNEndpoint,
  },
});
httpServer.start();
