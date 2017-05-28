var nodeswork = require('nodeswork'),
    logger = require('nodeswork-utils').logger,
    randomQuote = require('random-quote'),
    htmlToText = require('html-to-text');


nodeswork
  .config({
    server:       'http://localhost:28888',
    port:         28900,
    appletId:     '592281f962a5ed86bda7c5b9'
  })
  .withComponent(nodeswork.Messager)
  .process(async function(ctx) {
    logger.info("Processing hello world request.");
    var quote = (await randomQuote())[0],
        textContent = htmlToText.fromString(quote.content),
        messager = ctx.components.messager;

    logger.info("Get random quote:", quote);
    messager.sendMessage({
      message: textContent + '\n\n--By  ' + quote.title
    });
  })
  .start(function() {
    logger.info("Server is starting at port:", nodeswork.config('port'))
  })
