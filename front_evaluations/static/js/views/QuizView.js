var EvaluationsView = {};

// resetea formularios 
// trigger("reset");

//inicializa los formularios 
EvaluationsView.initialize = function(form, url, data, callback)
{
	
	/*
	* 1 - Set form name
	* 2 - Get form from service
	*/

	// 1 - Set form name
	debug_info("1 - Set form name")
	EvaluationsView.form_create = form;


	//2 - Get form from service
	debug_info("2 - Get form from service")
	
	create_form(
		url,
		EvaluationsView.form_create,
		'OPTIONS',
		callback,
		data
	);

	debug_info("3.4 - Show form")
	EvaluationsView.form_create.show();

}


// cambia el valor de ON por un True en un campo tipo boolean 
EvaluationsView.change_boolean = function(data){
	
	for (i = 0; i < $(data).find('input').length; i++) {
		if($(data).find('input')[i].value=== 'on'){

			$(data).find('input')[i].value =  true
			//console.log($(data).find('input')[i].value)
		}
	}
	return data
}

//---------------
// QUIZ
//---------------
EvaluationsView.create_quiz = function(form)
{
	form.submit(function (e) {
			e.preventDefault();

			var quizService = new QuizService();
			var form = EvaluationsView.change_boolean(($(e.target).get(0)))
			var data = new FormData(form);
			quizService.create(URL_CREATE_QUIZ, data, EvaluationsView.notifify_create_question)
	})
	
}

EvaluationsView.notifify_create_quiz = function(){
	
	//Notify.show_success("quiz creado", "el quiz fue creado con exito");
	location.href =  host+":"+location.port+"/evaluations/"; 
}


EvaluationsView.get_all_Quiz = function()
{
	var quizService = new QuizService();
	quizService.retrieve(URL_GET_ALL_QUIZ, EvaluationsView.render_all_quiz)	
}

EvaluationsView.render_all_quiz = function (response)
{	
	EvaluationsView.render_list_quiz($('#list-quiz'), response);
}

EvaluationsView.render_list_quiz = function(parent_container, response)
{
	for (i = response.length-1; i >= 0; i--) { 		
		
		// se crea el html     		
		var container = document.createElement("tr");
		container.className = 'row_quiz-'+i
		
		var number = document.createElement("td");
		$(number).text(i+1)

		var title_quiz = document.createElement("td");
		$(title_quiz).text(response[i].title)

		// para ver el detalle del quiz 
		var col_link = document.createElement("td");
		var link = document.createElement("a");
		var id = response[i].id;
	
		$(link).attr('href', host+":"+location.port+"/evaluations/detail/"+id);
		$(link).text('ver detalles')
		col_link.appendChild(link)

		// editar 
		var col_edit = document.createElement("td");
		var link = document.createElement("a");
		var icon = document.createElement("span")
		icon.className = 'glyphicon glyphicon-edit'
		icon.name = i

		link.addEventListener('click', function(e){ EvaluationsView.handle_edit(response, e.target.name, 'quiz') }, false);
		link.appendChild(icon)
		col_edit.appendChild(link)
		
		//eliminar 
		var col_del = document.createElement("td");
		var link2 = document.createElement("a");
		var icon2 = document.createElement("span")
		icon2.className = 'glyphicon glyphicon-trash'
		icon2.name = i

		link2.appendChild(icon2)
		col_del.appendChild(link2)
		
		//console.log('entro')
		//se pega a los contenedores 
		container.appendChild(number);
		container.appendChild(title_quiz);
		container.appendChild(col_link);
		container.appendChild(col_edit);
		container.appendChild(col_del);
		
		parent_container.prepend(container);

		link2.addEventListener('click', function(e){ EvaluationsView.handle_delete(response, e.target.name, 'quiz', $(e.target).parents('.row_quiz-'+e.target.name)) }, false);
	}
}

EvaluationsView.update_quiz = function(form, id)
{

	form.submit(function (e) {
			e.preventDefault();
	//		console.log('envio actualiza')
			var quizService = new QuizService();
			var form = EvaluationsView.change_boolean(($(e.target).get(0)))
			var data = new FormData(form);
			quizService.update(URL_DETAIL_QUIZ+id+'/', data, EvaluationsView.redirect_Categories)
	})
}

EvaluationsView.create_sitting_session = function(response){
	sessionStorage.setItem('sitting', JSON.stringify(response));
	$(location).attr('href', host+":"+location.port+"/evaluations/take/"+response.quiz); 
}

EvaluationsView.get_Quiz = function(){
	
	var id = location.pathname.split("/");
	id = id[id.length-1];

	$('.btn-create').click(function(e){
		e.preventDefault();
		var quizService = new QuizService();
		var data = JSON.parse($.session.get('user'))
		quizService.dispatch(URL_CREATE_SITTING+id+'/', data, EvaluationsView.create_sitting_session)
	})

	var quizService = new QuizService();
	quizService.retrieve(URL_DETAIL_QUIZ+id+'/', EvaluationsView.render_quiz)	
}


EvaluationsView.render_quiz = function(response){
	
	$('.titulos').text(response.title)
	$('.category').text('Categoria: '+response.category)
	$('.description').text('Descripción: '+response.description)
}

//------------------
//  TAKE QUiZ 
//------------------

// renderiza el formulario con las opciones de respuesta de una pregunta multichoice 
EvaluationsView.render_answer_mc = function(answers){
	
	var field_div = document.createElement("div");
	field_div.className = 'form-group';

	for (i = 0; i < answers.length; i++) {
	
		var ul = document.createElement("ul");
		ul.className = 'list-group'

		//verdadero
		var li = document.createElement("li");
		li.className = 'list-group-item'

		var label = document.createElement("spam");
		$(label).text(' '+answers[i].content)

		var input = document.createElement("input");
		input.type = 'radio';
		input.name = 'answered';
		input.value = answers[i].id;

		li.appendChild(input)
		li.appendChild(label)
		ul.appendChild(li)
		
		field_div.appendChild(ul)
	}

	// se pega al template
	$('#question_form').append(field_div)

}

// renderiza el formulario con las opciones de respuesta 
EvaluationsView.render_form_question = function(question){

	// se obtiene el tipo de pregunta 
	clase = question.clase

	// div base 
	var field_div = document.createElement("div");
	field_div.className = 'form-group container_answers';

	//campos id y tipo de pregunta para poder verificar 
	input_id = document.createElement("input");
	input_id.type = "hidden"
	input_id.value = question.id
	input_id.name = 'id'
	
	input_clase = document.createElement("input");
	input_clase.type = "hidden"
	input_clase.name = 'clase'

	// pregunta tipo ensayo 
	if(clase === 'Essay style question'){
		
		var input = document.createElement("input");	
		input.type = 'text';
		input.name = "answered"
		input.className = "form-control";
		input.maxLength = 100000
		field_div.appendChild(input)

		input_clase.value = question.clase
	}

	// pregunta tipo opcion multiple
	if(clase === 'Multiple Choice Question'){
		
		var quizService = new QuizService();
		quizService.retrieve(URL_GET_ALL_ANSWER_MC+question.id+'/', EvaluationsView.render_answer_mc)
		input_clase.value = question.clase

	}

	// pregunta tipo Verdadero/Falso
	if(clase === 'True/False Question'){
		
		var ul = document.createElement("ul");
		ul.className = 'list-group'

		//verdadero
		var li_true = document.createElement("li");
		li_true.className = 'list-group-item'

		var label_true = document.createElement("spam");
		$(label_true).text(' Verdadero ')

		var input = document.createElement("input");
		input.type = 'radio';
		input.name = 'answered';
		input.value = 'True';

		li_true.appendChild(input)
		li_true.appendChild(label_true)
		ul.appendChild(li_true)
		
		field_div.appendChild(ul)

		//falso
		var ul = document.createElement("ul");
		ul.className = 'list-group'

		var li_false = document.createElement("li");
		li_false.className = 'list-group-item'

		var label_false = document.createElement("spam");
		$(label_false).text('  Falso')

		var input2 = document.createElement("input");
		input2.type = 'radio';
		input2.name = 'answered';
		input2.value = 'False';

		li_false.appendChild(input2)
		li_false.appendChild(label_false)
		ul.appendChild(li_false)

		field_div.appendChild(ul)

		input_clase.value = question.clase
	}

	// se pega al template
	$('#question_form').append(field_div)

	$('#question_form').append(input_id)
	$('#question_form').append(input_clase)


}

//renderiza contenido e imagen de la pregunta 
EvaluationsView.render_question = function(question){
	
	$('#img-question').attr('src',question.figure)
	$('#question_content').text(question.content)

	EvaluationsView.render_form_question(question)	
}

// renderiza cuando califican una pregunta 
EvaluationsView.render_check = function(response){
	
	sitting = JSON.parse(sessionStorage.getItem('sitting'))

	if(response.correcta){

		$('#question-status').text('tu respuesta es correcta')
		$('#question-status').attr('class', 'text-success')

		$('#question-explication').text(response.explanation)
		$('#question-explication').attr('class', 'text-success')

		$('#container-continue').attr('class', 'col-md-12 bg-success')
			
		//actualiza puntuacion
		sitting.current_score++
		
	}else{
		
		$('#question-status').text('tu respuesta es incorrecta')
		$('#question-status').attr('class', 'text-danger')

		$('#question-explication').text(response.explanation)
		$('#question-explication').attr('class', 'text-danger')

		$('#container-continue').attr('class', 'col-md-12 bg-danger')
		
		sitting.incorrect_questions += response.id+','
	}

	//actualiza las respuestas del usuario 
	user_answers = JSON.parse(sitting.user_answers ) 
	
	if(response.clase === 'Multiple Choice Question'){

		//console.log(response.answerMC)
		user_answers[response.id] = response.answerMC
	}else{
		user_answers[response.id] = response.answered
	}
	user_answers = JSON.stringify(user_answers)
	sitting.user_answers = user_answers
	
	//actualiza la lista de preguntas 
	question_list = sitting.question_list
	sitting.question_list = EvaluationsView.remove_first_question(question_list)

	//se actualiza la session 
	sessionStorage.setItem('sitting', JSON.stringify(sitting));	

	$('#question_form').find('input, textarea, button, select').attr('disabled','disabled');
	
	$('#container-check').hide()
	$('#container-continue').fadeIn()

}

//eventos cuando califica una preguna 
EvaluationsView.btn_check = function(form){

	form.submit(function (e) {
			e.preventDefault()
			var quizService = new QuizService();
			var data = ($(e.target).get(0))
			data = $(data).serialize()
			//console.log(data)
			
			if (data.search('answered') !== -1) {
				quizService.dispatch(URL_QUALIFY_QUIZ, data, EvaluationsView.render_check)
			}
			else{
				Notify.show_error('', 'Por favor responda la pregunta')
			}
	})
}

//renderiza cuantas preguntas lleva contestadas 
EvaluationsView.current_proggres = function(user_answers, total_questions){
	
	answered = JSON.parse(user_answers)
	answered = Object.keys(answered).length+1
	$('#count_question').text( 'Pregunta: '+answered+'/'+total_questions)
}

//renderiza los puntos actuales 
EvaluationsView.get_current_score = function(current_score){
	
	$('#current_score').text( 'Puntos: '+current_score)
}

// obtiene la pregunta actual 
EvaluationsView.get_first_question = function(question_list){

	question_id = question_list.split(',', 1)
	question_id = question_id[0] 
	//console.log(question_list)

	var quizService = new QuizService();
	quizService.retrieve(URL_DETAIL_QUESTION+question_id+'/', EvaluationsView.render_question)
}

// elimina la pregunta de la lista para seguir con la proxima
EvaluationsView.remove_first_question = function(question_list){

	question_list =  question_list.replace(question_id[0]+',', "");
	return question_list
}

//guarda el estado del quiz una vez temina
EvaluationsView.save_status_quiz = function(sitting){
	
	// retoma la lista de preguntas
	sitting.question_list = sitting.question_order

	//marca el quiz completo 
	sitting.complete = true

	//marca la fecha y hora donde termino 
	fecha = new Date();
	sitting.end = fecha.toJSON()
	
	//guarda todo el estado del quiz 
	sessionStorage.setItem('sitting', JSON.stringify(sitting));	
}

// muestra los resultados
EvaluationsView.redirect_results = function(sitting){
	
	//elimina la session del quiz 
	$.session.remove('sitting');

	// redirige a mostrar los resultados 
	location.href =  host+":"+location.port+"/evaluations/marking/detail/"+sitting.id; 
}

// se ejecuta mientras hace el quiz 
EvaluationsView.take_quiz = function(btn_continue){

	sitting = JSON.parse(sessionStorage.getItem('sitting'))

	question_list = sitting.question_list
	total_questions = sitting.question_order.split(',').length-1


	if(sitting.question_list !== ""){

		// trae pregunta 1/n
		EvaluationsView.current_proggres(sitting.user_answers, total_questions)

		// trae la puntuacion actual de usuario 
		EvaluationsView.get_current_score(sitting.current_score)

		// trae la primera pregunta de la lista de preguntas
		EvaluationsView.get_first_question(question_list)	

		btn_continue.click(function (e) {
			e.preventDefault();
			if(sitting.question_list !== ""){		
				location.href =  window.location
			}else{
				//se guarda el resultado final en la session 
				EvaluationsView.save_status_quiz(sitting)

				//se guarda en la BD
				var quizService = new QuizService();
				quizService.update2( URL_UPDATE_SITTING+sitting.id+'/', sitting, EvaluationsView.redirect_results)
			}
		})

	}else{

		//console.log('hola')
             
	}
}

//---------------
//	MARKING
//---------------

EvaluationsView.get_marking_detail = function(){

	var id = location.pathname.split("/");
	id = id[id.length-1];

	var quizService = new QuizService();
	quizService.retrieve(URL_MARKING_DETAIL_QUIZ+id+'/', EvaluationsView.render_results)
}

EvaluationsView.render_results = function(sitting){
		
	if (sitting.check_if_passed) {
		$('#titulo').text('Examen Aprobado: '+sitting.quiz)
		
	}else{
		$('#titulo').text('Examen Desaprobado '+sitting.quiz)
	}

	$('#result_message').text(sitting.result_message)	
	$('#percent').text(sitting.get_percent_correct+'%')
	$('#score').text(sitting.current_score)
	$('#finish').text(jQuery.timeago(sitting.end))

	
	total_questions = sitting.question_order.split(',').length-1

	answers = sitting.questions_with_user_answers
	//console.log(answers)
	

	index = 0
	$.each(answers, function(key, value) {

		var container = document.createElement("tr");
		
		var question = document.createElement("td");
		$(question).text(key)

		var answered = document.createElement("td");
		$(answered).text(value)


		var qualify = document.createElement("td");
		
		 
		//verifico q la pregunta sea correcta o no en la lista de respuestas incorrectas
		user_answers = JSON.parse(sitting.user_answers)
		dato = sitting.incorrect_questions.split(',')
		dato = dato[index]
		index++
		$.each(user_answers, function(k, v) {
			
			if ( k === dato) {
				$(qualify).text('incorrecta')
				return false
			}else{
				$(qualify).text('correcta')
			};
		})
	
		//se pega a los contenedores 
		container.appendChild(question);
		container.appendChild(answered);
		container.appendChild(qualify);
		
		$('#list-results').prepend(container);		
	});
}


EvaluationsView.call_render_marking = function(response){

	EvaluationsView.render_marking_quiz($('#list-marking'),response)
}

EvaluationsView.get_all_marking_quiz = function(){

	var quizService = new QuizService();
	quizService.retrieve(URL_MARKING_QUIZ, EvaluationsView.call_render_marking)
}


EvaluationsView.render_marking_quiz = function(parent_container, response)
{
	///console.log(response)
	for (i = 0; i < response.length; i++) { 		
		
		// se crea el html     		
		var container = document.createElement("tr");
		
		var user = document.createElement("td");
		$(user).text(response[i].user)

		var quiz = document.createElement("td");
		$(quiz).text(response[i].quiz)


		var complete = document.createElement("td");
		$(complete).text(jQuery.timeago(response[i].end))

				
		var score = document.createElement("td");
		$(score).text(response[i].get_percent_correct)

		//se pega a los contenedores 
		container.appendChild(user);
		container.appendChild(quiz);
		container.appendChild(complete);
		container.appendChild(score);
		
		parent_container.prepend(container);
	}
}
