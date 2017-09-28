import * as kiws       from '@nodeswork/kiws';
import * as applet     from '@nodeswork/applet';

import * as htmlToText from 'html-to-text';

const randomQuote = require('random-quote');

@applet.WorkerProvider({})
class QuoteWorker {

  @kiws.Input() twitter: applet.TwitterAccount;

  @applet.Worker({})
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
        result.err = e;
      }
    }

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
