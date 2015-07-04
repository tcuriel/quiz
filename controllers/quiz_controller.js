var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
  /*models.Quiz.findById(quizId).then(
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
	
  models.Quiz.findById(2).then(
    function(quiz){
	  models.Quiz.destroy().then(function(2) {
        if (u && u.deletedAt) {
          console.log('// successfully deleted the project');
        }
      })
    }
	
  ).catch(function(error){next(error);});*/
  
  models.Quiz.destroy({
    where: {
       id: 3
    }
})
};

// GET /quizes
exports.index = function(req, res){
  models.Quiz.findAll().then(
    function(quizes){
      res.render('quizes/index.ejs',{ quizes: quizes});
    }
  ).catch(function(error){next(error);});
};

// GET /quizes/question
// GET /quizId/:id
exports.show = function(req, res){
  res.render('quizes/show',{ quiz: req.quiz});
};

// GET /quizes/answer
// GET /quizes/:id/answer
exports.answer = function(req, res){
  var resultado = 'Incorrecto';
  if(req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto';
  }
  res.render('quizes/answer',{ quiz: req.quiz, respuesta: resultado });
};
