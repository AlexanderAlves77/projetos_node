import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import { Phrase } from '../models/Phrase';

export const ping = (req: Request, res: Response) => {
  res.json({ pong: true });
}

export const random = (req: Request, res: Response) => {
  let nRand: number = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  res.json({ number: nRand });
}

export const nome = (req: Request, res: Response) => {
  let nome: string = req.params.nome;
  res.json({ nome: nome });
}

export const createPhrase = async (req: Request, res: Response) => {
  let author: string = req.body.author;
  let txt: string = req.body.txt;
  let newPhrase = await Phrase.create({ author: author, txt: txt });
  res.status(201);
  res.json({ id: newPhrase.id, author: newPhrase.author, txt: newPhrase.txt });
}

export const listPhrases = async (req: Request, res: Response) => {
  let list = await Phrase.findAll();
  res.json({ list: list });
}

export const getPhrase = async (req: Request, res: Response) => {
  let id = req.params.id;
  let phrase = await Phrase.findByPk(id);
  if(phrase) {
    res.json({ phrase: phrase });
  } else {
    res.json({ error: 'Frase não encontrada' });
  }
}

export const putPhrase = async (req: Request, res: Response) => {
  let id = req.params.id;
  let { author, txt } = req.body;
  let phrase = await Phrase.findByPk(id);

  if(phrase) {
    phrase.author = author;
    phrase.txt = txt;
    await phrase.save();

    res.json({ phrase: phrase });
  } else {
    res.json({ error: 'Frase não encontrada' });
  }
}

export const delPhrase = async (req: Request, res: Response) => {
  let id = req.params.id;
  await Phrase.destroy({ where: { id: id } });

  res.json({});
}

export const randomPhrase = async (req: Request, res: Response) => {
  let phrase = await Phrase.findOne({
    order: [ Sequelize.fn('RAND') ]
  });

  if(phrase) {
    res.json({ phrase: phrase });
  } else {
    res.json({ error: 'Não há frases cadastradas.' });
  }
}

export const uploadFile = (req: Request, res: Response) => {
  console.log("FILE", req.file);
  console.log("FILES", req.files);
  
  res.json({});
}


/*
export const uploadFile = (req: Request, res: Response) => {
  type UploadTypes = {
    avatar: Express.Multer.File[],
    gallery: Express.Multer.File[],
  }
  
  const files = req.files as UploadTypes;
  console.log("ARQUIVOS", files.avatar);
  console.log("GALLERY", files.gallery);
  
  res.json({});
}*/