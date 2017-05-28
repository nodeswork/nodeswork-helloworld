var nodeswork = require('nodeswork'),
    logger = require('nodeswork-utils').logger,
    randomQuote = require('random-quote'),
    htmlToText = require('html-to-text');


nodeswork
  .config({
    server:       'http://localhost:28888',
    port:         28900,
    appletId:     '592281f962a5ed86bda7c5b9',
  })
  .withComponent(nodeswork.Messager)
  .process(async function(ctx) {
    logger.info("Processing hello world request.");
    var quote = await randomQuote(),
        textContent = htmlToText.fromString(quote.content),
        messager = ctx.components.messager;

    messager.sendMessage({
      message: textContent + '  BY  ' + quote.title
    });
  })
  .start(function() {
    logger.info("Server is starting at port:", nodeswork.config('port'))
  })
