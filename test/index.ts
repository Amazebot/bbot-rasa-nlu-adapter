import * as bot from 'bbot'
import * as rasa from '../src'

bot.adapters.nlu = rasa.use(bot)

bot.global.NLU(
  { intent: { is: 'greet' } },
  (b) => b.respond('👋'),
  { id: 'greeting', force: true }
)

bot.start()