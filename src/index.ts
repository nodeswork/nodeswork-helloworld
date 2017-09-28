import * as kiws       from '@nodeswork/kiws';
import * as applet     from '@nodeswork/applet';

import * as htmlToText from 'html-to-text';

const randomQuote = require('random-quote');

@applet.WorkerProvider({})
class QuoteWorker {

  @kiws.Input() twitter: applet.TwitterAccount;

  @applet.Worker({})
  async quote() {
    const quote = (await randomQuote())[0];
    const textContent = htmlToText.fromString(quote.content);

    let status = 'ok';
    let err = null;

    if (this.twitter == null) {
      status = 'No twitter account';
    }

    try {
      this.twitter.tweet({
        status: textContent,
      });
    } catch (e) {
      status = 'tweet failed';
      err = e;
    }

    return {
      status,
      quote,
      textContent,
    };
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
