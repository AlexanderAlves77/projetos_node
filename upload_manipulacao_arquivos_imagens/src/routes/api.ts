import { Router } from 'express';
import multer from 'multer';
import * as ApiController from '../controllers/apiController';

/*
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './tmp');
  }, 
  filename: (req, file, cb) => {
    let randomName = Math.floor(Math.random() * 9999999);
    cb(null, file.fieldname+'-'+randomName+'.jpg')
  }, 
}) */

const upload = multer({ 
  dest: './tmp',
  fileFilter: (req, file, cb) => {
    const allowed: string[] = ['image/jpg', 'image/jpeg', 'image/png'];
    cb(null, allowed.includes(file.mimetype));
  },
  limits: { fieldSize: 2000000 }
});

const router = Router();

router.get('/ping', ApiController.ping);
router.get('/random', ApiController.random);
router.get('/nome/:nome', ApiController.nome);

router.get('/frase/aleatoria', ApiController.randomPhrase);
router.get('/frase/:id', ApiController.getPhrase);
router.put('/frase/:id', ApiController.putPhrase);
router.delete('/frase/:id', ApiController.delPhrase);
router.post('/frases', ApiController.createPhrase);
router.get('/frases', ApiController.listPhrases);

router.post('/upload', upload.single('avatar'), ApiController.uploadFile);

export default router;