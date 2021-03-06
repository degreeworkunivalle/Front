var Error = {};

//server
Error.server_not_found = function()
{
	Notify.show_error("Servidor", "No se pudo conectar al servidor");
}


Error.server_internal_error = function()
{
	Notify.show_error("Servidor", "Problemas en el servidor");
}



//urls
Error.url_not_found = function()
{
	Notify.show_error("Servidor", "No se pudo encontrar el recurso solicitado");
}


//urls
Error.UNAUTHORIZED = function(message)
{
	var msg = "No tienes permiso para realizar esta acción";
	if (message)
	{
		msg += ' : '+message;
	}
	Notify.show_error("Usuario", msg);
}

//Forms
Error.BAD_REQUEST = function()
{
	Notify.show_error("DATOS", "Los datos ingresados están incompletos");
}