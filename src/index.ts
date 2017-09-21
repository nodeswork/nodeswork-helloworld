import { kiws, applet } from 'nodeswork';
import * as htmlToText  from 'html-to-text';

const randomQuote = require('random-quote');

@applet.WorkerProvider({})
class QuoteWorker {

  @kiws.Input() twitter: applet.TwitterAccount;

  @applet.Worker({})
  async quote() {
    const quote = (await randomQuote())[0];
    const textContent = htmlToText.fromString(quote.content);

    return {
      status: 'done',
      target: this.twitter,
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
