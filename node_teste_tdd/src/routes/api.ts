import { Router } from 'express';
import * as ApiController from '../controllers/apiController';

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

export default router;