import * as kiws       from '@nodeswork/kiws';
import * as applet     from '@nodeswork/applet';
import * as logger     from '@nodeswork/logger';

import * as htmlToText from 'html-to-text';

const randomQuote = require('random-quote');
const LOG = logger.getLogger();

@applet.WorkerProvider({})
class QuoteWorker {

  @kiws.Input() twitter: applet.TwitterAccount;

  @applet.Worker({
    name: 'Quote',
    schedule: '0 0 8 * * *',
    default: true,
  })
  async quote() {
    const result: any = {
      status: 'ok',
    };

    const quote = (await randomQuote())[0];
    const textContent = htmlToText.fromString(quote.content);

    result.quote = quote;
    result.textContent = textContent;

    if (this.twitter == null) {
      result.status = 'No twitter account';
    } else {
      try {
        result.tweetRespose = await this.twitter.tweet({
          status: textContent,
        });
      } catch (e) {
        result.status = 'tweet failed';
        result.err = JSON.parse(JSON.stringify(e));
      }
    }

    LOG.info('quote is executed', result);

    return result;
  }
}

@applet.Module({
  workers: [
    QuoteWorker,
  ],
  providers: [
    applet.TwitterAccount,
  ],
})
class QuoteModule {

  constructor() { }
}

applet.bootstrap(QuoteModule);
