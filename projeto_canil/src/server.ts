import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mustache from 'mustache-express';
import path from 'path';
import mainRoutes from './routes/index';

dotenv.config();
const server = express();

server.set('new engine', 'mustache');
server.set('views', path.join(__dirname, 'views'));
server.engine('mustache', mustache());

server.use(express.static(path.join(__dirname, '../public')))

server.use(mainRoutes);

server.use((req: Request, res:Response) => {
  res.send("404 - Página não encontrada.");
});


server.listen(process.env.PORT, () => console.log('Servidor rodando na porta 4000.'));

