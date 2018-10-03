import * as bBot from 'bbot'

export interface IIntent {
  confidence: number
  name: string
}

export interface IParsedResult {
  project: string
  entities: any[]
  intent: IIntent
  text: string
  model: string
  intent_ranking: IIntent[]
}

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
  async parse (q: string): Promise<IParsedResult> {
    const url = `${this.bot.settings.get('rasa-url')}/parse`
    const project = this.bot.settings.get('rasa-project')
    return this.bot.request.post(url, { q, project })
  }

  async process (message: bBot.TextMessage) {
    try {
      const parsed = await this.parse(message.toString())
      const results: bBot.NaturalLanguageResultsRaw = {}
      if (parsed.intent) {
        results.intent = []
        for (let intent of parsed.intent_ranking) {
          results.intent.push(this.parseSchema(intent, {
            score: 'confidence'
          }, intent))
        }
      }
      if (Array.isArray(parsed.entities)) {
        results.entities = []
        for (let entity of parsed.entities) {
          results.entities.push(this.parseSchema(entity, {
            name: 'value',
            id: 'entity'
          }, entity))
        }
      }
      this.bot.logger.debug(`[rasa] NLU results: ${JSON.stringify(results)}`)
      return results
    } catch (err) {
      this.bot.logger.error(`[rasa] ${err.message}`)
      return
    }
  }
}

/** Standard bBot adapter initialisation method */
export const use = (bot: typeof bBot) => Rasa.getInstance(bot)
