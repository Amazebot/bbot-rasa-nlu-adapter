import * as bBot from 'bbot'

/** Rasa NLU adapter, parses messages for intent, entities, actions */
export class Rasa extends bBot.NLUAdapter {
  /** Name of adapter, used for logs */
  name = 'rasa-nlu-adapter'

  /** Singleton pattern instance */
  private static instance: Rasa

  /** Prevent direct access to constructor for singleton adapter */
  private constructor (bot: typeof bBot) {
    super(bot)
    this.bot.settings.extend({
      'rasa-url': {
        type: 'string',
        description: 'URL of Rasa NLU http server',
        default: 'http://localhost:5000'
      },
      'rasa-project': {
        type: 'string',
        description: 'Project name for Rasa queries',
        default: 'current'
      }
    })
  }

  /** Singleton instance init */
  static getInstance (bot: typeof bBot) {
    if (!Rasa.instance) Rasa.instance = new Rasa(bot)
    return Rasa.instance
  }

  /** @todo Connection and credential check on startup */
  async start() {}

  /** @todo Close conversations? */
  async shutdown() {}
  
  /** Get NLU result from Rasa API parse endpoint  */
  async parse (q: string) {
    const url = `${this.bot.settings.get('rasa-url')}/parse`
    const project = this.bot.settings.get('rasa-project')
    const parsed = await this.bot.request.post(url, { q, project })
    return parsed
  }

  async process (message: bBot.TextMessage) {
    try {
      const parsed = await this.parse(message.toString())
      this.bot.logger.warn(`[rasa] parse response: ${JSON.stringify(parsed)}`)
      const results: bBot.NaturalLanguageResultsRaw = {}
      return results
    } catch (err) {
      this.bot.logger.error(`[rasa] ${err.message}`)
      return
    }
  }
}

/** Standard bBot adapter initialisation method */
export const use = (bot: typeof bBot) => Rasa.getInstance(bot)
