
  
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateIntern } = require('../middleware');
const intern=require('../controllers/interns')


//about
router.get('/about',intern.about)

router.route('/')
        .get(catchAsync(intern.index))
        .post(isLoggedIn ,validateIntern ,catchAsync(intern.createIntern))

router.get('/new', isLoggedIn,intern.renderNewForm)


router.route('/:id')
        .get(catchAsync(intern.showIntern))
        .put(isLoggedIn ,isAuthor, validateIntern,catchAsync(intern.updateIntern))
        .delete(isLoggedIn,isAuthor,catchAsync(intern.deleteIntern));

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(intern.renderEditForm))


module.exports = router;