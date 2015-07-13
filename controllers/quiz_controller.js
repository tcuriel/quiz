var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
  models.Quiz.findById(quizId).then(
    function(quiz){
	  if(quiz){
	    req.quiz = quiz;
		console.log(req.quiz+' --- '+quiz)
		next();
	  } else {
	    var menssageError = 'No existe quizId=' + quizId;
	    var newError = new Error(menssageError);
	    next(newError); 
	  }
	}	
  ).catch(function(error){next(error);});
  
    /*models.Quiz.findById(2).then(
    function(quiz){
	  models.Quiz.destroy().then(function(2) {
        if (u && u.deletedAt) {
          console.log('// successfully deleted the project');
        }
      })
    }*/
	
  /*models.Quiz.destroy({
    where: {
       id: 3
    }
  })*/
  
};

// GET /quizes
exports.index = function(req, res){
  var quizString = '%' + req.query.search + '%'
  quizString = quizString.replace(' ','%');
  //models.Quiz.findAll({where: ["pregunta like ?", quizString], order:'pregunta'}).then(
  models.Quiz.findAll({order:'pregunta'}).then(
    function(quizes){
      res.render('quizes/index.ejs',{ quizes: quizes, errors: []});
    }
  ).catch(function(error){next(error);});
};

// GET /quizes/question
// GET /quizId/:id
exports.show = function(req, res){
  res.render('quizes/show',{ quiz: req.quiz, errors: []});
};

// GET /quizes/answer
// GET /quizes/:id/answer
exports.answer = function(req, res){
  var resultado = 'Incorrecto';
  if(req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto';
  }
  res.render(
    'quizes/answer',
	{ quiz: req.quiz, 
	  respuesta: resultado,
	  errors: []
	}
  );
};

// GET /quizes/new
exports.new = function(req, res){
  var quiz = models.Quiz.build(	// crea objeto quiz
    {pregunta: 'Pregunta', respuesta: 'Respuesta'}
  );
  res.render('quizes/new',{quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res){
  var quiz = models.Quiz.build(req.body.quiz);
  
  quiz
  .validate()
  .then(
    function(err){
	  if (err){
	    res.render('quizes/new', {quiz: quiz, errors: err.errors});
	  }else{
	    quiz	// save guarda en DB campo pregunta y respuesta de quiz
		.save({fields: ['pregunta', 'respuesta']})
		.then(function(){res.redirect('/quizes')})
	  }			// res.redirect: Redirección HTTP a lista de preguntas
	}
  );
};

// GET /quizes/:id/edit
exports.edit = function(req, res){
  var quiz = req.quiz;	// autoload de instancia de quiz
  
  res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res){
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  
  req.quiz
  .validate()
  .then(
    function(err){
	  if(err){
	    res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
	  }else{
	    req.quiz	// save: guarda campos pregunta y respuesta en DB
		.save({fields: ['pregunta', 'respuesta']})
		.then(function(){res.redirect('/quizes');});
	  }		// Redireción HTTP a lista de preguntas (URL relativo)
	}
  );
};

// DELETE /quizes/:id
exports.destroy = function(req, res){
  req.quiz.destroy().then(function(){
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};