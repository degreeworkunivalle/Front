var WikiService = {};

WikiService.create_page = function(form, url, callback)
{
	this.doRequest(form, url, "POST", callback);
}

WikiService.edit_page = function(form, url, callback)
{
	this.doRequest(form, url, "POST", callback);
}

WikiService.doRequest = function (form, url, method, callback)
{
	$("#preloader_2").show();

	formSerialized = $(form).serialize();

	//remove all errors from before
	remove_all_errors(formSerialized);


	$.ajax({
		type: method,
		url: url,
		data: formSerialized,
		beforeSend : function( xhr ) {
    		xhr.setRequestHeader("Authorization", Token.get_RequestHeader() );
    	}
	})
	.done(function(response){
		/*
		Create succesful, then do anything
		*/

		WikiModel.page = response;

		if (callback) {callback(WikiModel)};

	})
	.fail(function(error){		
		console.log(error);

		//if status ==0  -> can't connect to server
		if(0 == error.status)
		{
			Error.server_not_found();
		}

		//if BAD REQUEST -> show error response in fields form
		if(400 == error.status)
		{
			show_errors(formSerialized, error.responseJSON);
			Error.BAD_REQUEST();
		}
		//if INTERNAL SERVER ERROR
		if(500 == error.status)
		{
			//if url is incorret
			Error.server_internal_error();
		}
	})
	.always(function(){
		//console.log("always");
		$("#preloader_2").hide();
	});

}

WikiService.get_page = function (url, callback) {	

	$("#preloader_2").show();

	$.ajax({
		type: 'GET',
		url: url,
		beforeSend : function( xhr ) {
    		xhr.setRequestHeader( "Authorization", Token.get_RequestHeader() );
    	}
	})
	.done(function(response){
		if(callback)
		{
			callback(response);
		}
		
	})
	.fail(function(error){		
		console.log(error);
		//if status ==0  -> can't connect to server
		if(0 == error.status)
		{
			Error.server_not_found();
		}

		//if BAD REQUEST -> show error response in fields form
		if(400 == error.status)
		{

		}

		else if(401 == error.status)
		{
			
		}
		else if(404 == error.status)
		{
			Notify.show_error('404', 'No se encontró')
			var url = Site.geRootUrl()+'/wiki/404';
			window.location.replace(url);
		}
		//if INTERNAL SERVER ERROR
		else if(500 == error.status)
		{
			//if url is incorret
			Error.server_internal_error();
		}
	})
	.always(function(){
		console.log("always");
		$("#preloader_2").hide();
	});
}


WikiService.approve_request = function (url, action,callback) {	

	$("#preloader_2").show();


	$.ajax({
		type: 'POST',
		url: url,
		data: {'action': action},
		beforeSend : function( xhr ) {
        	xhr.setRequestHeader( "Authorization", Token.get_RequestHeader());
    	}
	})
	.done(function(response){
		if(callback)
		{
			callback(response);
		}
		
	})
	.fail(function(error){		
		console.log(error);
		//if status ==0  -> can't connect to server
		if(0 == error.status)
		{
			Error.server_not_found();
		}

		//if BAD REQUEST -> show error response in fields form
		if(400 == error.status)
		{

		}

		else if(401 == error.status)
		{
			
		}
		else if(404 == error.status)
		{
			Notify.show_error('404', 'No se encontró')
			var url = location.origin+'/wiki/404';
			window.location.replace(url);
		}
		//if INTERNAL SERVER ERROR
		else if(500 == error.status)
		{
			//if url is incorret
			Error.server_internal_error();
		}
	})
	.always(function(){
		console.log("always");
		$("#preloader_2").hide();
	});
}

/*
WikiService.update_page = function(url, data)
{
	$.ajax({
		type: 'POST',
		url: url,
		data: data,
    	beforeSend : function( xhr ) {
        	xhr.setRequestHeader( "Authorization", JSON.parse($.session.get("Token")).token_type +" "+ JSON.parse($.session.get("Token")).access_token );
    	}
	})
	.done(function(response){
		
		//Register succesful, then do anything
		
		console.log(response)
		Notify.show_success("OK", "Pagina creada");
	})
	.fail(function(error){		
		console.log(error);

		//if status ==0  -> can't connect to server
		if(0 == error.status)
		{
			Error.server_not_found();
		}

		//if BAD REQUEST -> show error response in fields form
		if(400 == error.status)
		{
			show_errors(formSerialized, error.responseJSON);
			Notify.show_error("DATOS", "Los datos ingresados están incompletos");
		}
		//if INTERNAL SERVER ERROR
		if(500 == error.status)
		{
			//if url is incorret
			Error.server_internal_error();
		}
	})
	.always(function(){
		//console.log("always");
		$("#preloader_2").hide();
	});
}*/


WikiService.get_list = function (url, callback) {
    
	$.ajax({
		type: 'GET',
		url: url,
		beforeSend : function( xhr ) {
    		xhr.setRequestHeader( "Authorization", Token.get_RequestHeader() );
    	}
	})
	.done(function(response){
		if (callback) {callback(response)};			
	})
	.fail(function(error){		
		console.log(error);
		//if status ==0  -> can't connect to server
		if(0 == error.status)
		{
			Error.server_not_found();
		}

		//if BAD REQUEST -> show error response in fields form
		else if(400 == error.status)
		{
		}
		else if(401 == error.status)
		{
			
		}
		// if UNAUTHORIZED ->
		else if(403 == error.status)
		{
			Error.UNAUTHORIZED()
		}
		//if INTERNAL SERVER ERROR
		else if(500 == error.status)
		{
			//if url is incorret
			Error.server_internal_error();
		}
	})
	.always(function(){
		console.log("always");
	});
}