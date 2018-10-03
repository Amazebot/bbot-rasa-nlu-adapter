import * as bot from 'bbot'
import * as rasa from '../src'

bot.adapters.nlu = rasa.use(bot)

bot.global.NLU(
  { intent: { name: 'greet', operator: 'max' } },
  (b) => b.respond('👋'),
  { id: 'greeting' }
)

bot.start()