var nodeswork = require('nodeswork'),
  logger = require('nodeswork-utils').logger;


nodeswork
  .config({
    server: 'http://localhost:28888',
    port: 28900,
  })
  .process(async function(ctx) {
    logger.info("Processing hello world request.");
  })
  .start(function() {
    logger.info("Server is starting at port:", nodeswork.config('port'))
  })
