var ActivitieChildView = function()
{
}

ActivitieChildView.prototype.list = function(url)
{
	var activitieService = new ActivitieChildService();
	activitieService.list(url, this.render_list);
}

ActivitieChildView.prototype.render_list = function(response)
{
	console.log(response)
	if (0 == response.count)
	{
		$("#msg_list_activitie").empty()
		$("<span>Aún no hay envíos</span>").appendTo( "#msg_list_activitie" );
	}
	for (var i=0, len=response.results.length; i<len;i++) {
		console.log(response.results[i])
		ActivitieChildView.prototype.render_activitie(response.results[i])
		//$("<br>").appendTo( "#list_activitie" );
	};

}

ActivitieChildView.prototype.render_activitie = function(response)
{
	$("<input id='activitie_id' value='"+response.id+"'' type='hidden'</input>" ).appendTo( "#list_activities" );
	
	var container = "<div class='col-md-12 result'>";

	ActivitieParentView.render_current_child(response, $("#list_activitie"));

}

ActivitieChildView.prototype.check = function(id, data)
{
	var url = URL_CHECK_ACTIVITIE_CHILD.replace(/\%id%/g, id);
	url = url.replace(/\%slug%/g, slug);
	console.log(url)

	data = {'action': data}

	var activitieService = new ActivitieChildService();
	activitieService.check(
		url,
		data,
		function(e){
			Notify.show_success("Actividades", "Actividad "+e.msg);
		});

}

ActivitieChildView.prototype.handler_created_form = function(form){
	$($("#id_parent")[0]).val(ACTIVITIE_ID);
	$($("#id_parent")[0]).hide();

	$("#send_activitie").fadeIn();

	$(form).submit(function(e){
		e.preventDefault();
		
		var data = new FormData($(e.target).get(0));
		var activitieService = new ActivitieChildService();
		activitieService.create(URL_CREATE_ACTIVITIE_CHILD, data, ActivitieChildView.prototype.succes_create);
	});

}

ActivitieChildView.prototype.succes_create = function(response)
{
	$("#send_activitie").fadeOut();
	$("#msg_succes").append("<span>La actividad ha sido enviada</span>");
	$("#msg_succes").fadeIn()
	ActivitieParentView.render_current_child(response);
}

/*
ActivitieChildView.prototype.load = function(id)
{
	var activitieService = new ActivitieChildService();
	var url = URL_CREATE_ACTIVITIE_Child+id;
	activitieService.retrieve(url , this.render_activite);
}

ActivitieChildView.prototype.render_activite = function(response)
{
	$("<p id='id_name'>"+response.name+"</p>" ).appendTo( "#activitie" );
	$("<p id='id_description'>"+response.description+"</p>" ).appendTo( "#activitie" );
	$("<p id='id_die_at'>"+response.die_at+"</p>" ).appendTo( "#activitie" );
	$("#activitie").fadeIn();

	$("#btn_active_send").click(function(e){
		console.log("click")
	})
}

*/
var ActivitieChildForm = function(form){
	create_form(
		URL_CREATE_ACTIVITIE_CHILD,
		form,
		'OPTIONS',
		ActivitieChildView.prototype.handler_created_form
	);
}