var main = function(){
	UserView.showCurrentUser();
	url_register = 'http://127.0.0.1:8080/API/users/';


	//form register
	form_register = $("#form_register");
	create_form(url_register, form_register, 'OPTIONS');
	form_register.submit(function (e) {
		e.preventDefault();
		register(form_register, url_register);
	})

	//form login
	form_login = $("#form_login");
	form_login.submit(function (e) {
		e.preventDefault();
		console.log(form_login.serialize());
		login(form_login, 'http://127.0.0.1:8080/API/auth/token/');
	})


	//action event to logout

	$("#button_logout").click(function(e){
		e.preventDefault();
		UserService.deauthenticate("http://127.0.0.1:8080/API/auth/revoke_token/");
		UserView.showCurrentUser();
	});

};

	
$(document).ready(main);
