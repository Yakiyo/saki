import { CommandHandler } from './struct/commandHandler';
import 'dotenv/config';

const asGlobal = process.env.NODE_ENV === 'production' ? true : false;

// We should deploy globally on prod. Maybe?
new CommandHandler().registerInteractions(asGlobal);
