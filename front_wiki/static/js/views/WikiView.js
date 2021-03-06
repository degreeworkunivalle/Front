var WikiView = {};

//Class Attr
//WikiView.list_request : div with a list of requests

/*CREATE*/

WikiView.initialize = function(form, editor)
{
	/*
	* 1 - Set form name
	* 2 - Get form from service
	* 3 - WikiView.succes_create_form
	*/

	// 1 - Set form name
	WikiView.form_create = form;
	WikiView.editor = editor;

	//2 - Get form from service
	create_form(
		URL_CREATE_PAGE_WIKI,
		WikiView.form_create,
		'OPTIONS',
		WikiView.succes_create_form
	);

}


WikiView.succes_create_form = function()
{
	//debug_info("3 - WikiView.succes_create_form")
	/*
	* 1 - Load Markup editor
	* 2 - add fields
	* 3 - Set events handler
	* 4 - Show form
	*/
    
    //1 - Load Markup editor
    //debug_info("3.1 - Load Markup editor")
	//MarkdownEditor.load(WikiView.editor);
	//MarkupEditor.load(WikiView.editor);

	//2 - hidde raw field
	//debug_info("3.2 - add extra fields")
	//WikiView.hidde_input_raw($("#id_raw"));
	$("#id_raw").remove()
	$('textarea').attr("name", "raw")

	//3 - Set events handler
	//debug_info("3.3 - Set events handler")

		// -> generate slug
		$($("input[name=title]")[0]).keyup( function(){
			var title = $(this).val();
	        var url = $('input#id_slug');
	        $($("input[name=slug]")[0]).val(WikiView.slugter(title));
	    });
		//$('#id_slug').hide()

	    //-> onsubmit
	    var url = URL_CREATE_PAGE_WIKI_MODULE.replace(/\%slug%/g, slug);

        WikiView.form_create.submit(function(e){
			e.preventDefault();
			
			WikiService.create_page(
				e.target,
				url,
				WikiView.create_succes
			);
        

		});


	//4 - Show form
	//debug_info("3.4 - Show form")
	WikiView.form_create.show();
}

WikiView.create_succes = function(wiki)
{
	//debug_info("- create_succes")
	Notify.show_success("Wiki", "Página creada");

	$("#formContent").fadeOut()

	var url = '';

	//dependiendo de los permisos de usuario se muesttra un mensaje u otro
	var s = StorageClass.getInstance();
	if(-1 != s.storage.get("permissions").indexOf("wiki.can_approve_request")){
		$("#editaded_page_admin").fadeIn();
		url = Module.getURL(SLUG, "wiki", wiki.page.slug);
		$("#url_wiki_request_admin").attr('href', url );

	}else
	{
		$("#editaded_page").fadeIn();
		url = wiki.page.slug+'..'+JSON.parse(wiki.page.extra_data).parent;
		$("#url_wiki_request").attr('href', url);
	}

}

WikiView.slugter = function (str)
{
	str = str.replace(/\s/g,'-');
	str = str.replace(/[^a-zA-Z0-9]/g,"");
	str = str.toLowerCase();
	return str;
}

WikiView.hidde_input_raw = function(input)
{

	//set listener
	//append editor content to raw input
	$('textarea').keyup(function(e){
		$(input).val(WikiView.editor.val())
		//console.log(WikiView.editor.val())
		
    });
	input.hide();
}


/*RETRIEVE*/

WikiView.load_page = function(slug)
{
	//debug_info("Load Page")

	var url = URL_DETAIL_ONE_PAGE + slug;
	WikiService.get_page(url, WikiView.render_page);
}


WikiView.load_version = function(version, slug)
{
	//debug_info("Load version")

	var url = URL_VERSION_PAGE.replace(/\%slug%/g, slug);
	url = url.replace(/\%version%/g, version);

	WikiService.get_page(url, WikiView.render_version);
}


WikiView.render_version = function(page)
{
	$("#wiki_title").text(page.title);
	$("#wiki_version").text(page.version);
	$("#markdown").html(markdown.toHTML(page.raw.raw));
	//var mod_slug come from html template
	var url = location.origin+'/'+mod_slug+'/wiki/'+page.slug;
	
	//to approve a request
	var s = StorageClass.getInstance();
	if(-1 != s.storage.get("permissions").indexOf("wiki.can_approve_request")){

		var url_approv = URL_APPROVE_REQUEST.replace(/\%slug%/g, page.slug);
		url_approv = url_approv.replace(/\%version%/g, page.version);
		
		$("#submit_approved > a").click(function(e){
			WikiService.approve_request(url_approv, "approved", WikiView.approve_succes);
		});
		$("#submit_approved").show();

		$("#submit_rejected > a").click(function(e){
			WikiService.approve_request(url_approv, "reject", WikiView.approve_succes);
		});
		$("#submit_rejected").show();

	}
	//end approve


	$("#show_current > a").attr('href', url)
	$("#show_current").show();

	// se oculta todo lo relacionado con los comentarios
	$('#title_edit').show()
	$('#list-comment-wiki').hide()
	$('#load-comment-wiki').hide()
	$('.titulos').hide()
	$('.comment').hide()
}


WikiView.render_page = function(page)
{
	//console.log("render_page")
	//console.log(page)
	$("#wiki_title").text(page.title);
	$("#wiki_version").text(page.version);
	$("#wiki_slug").text(page.slug)
	$("#markdown").html(markdown.toHTML(page.raw));
	$("#wiki_raw").html(page.raw);


	/*Esto es para editarla*/
	var edit = document.createElement("a");
	edit.className = "pull-right"
	var edit_msg = document.createElement("span");
	edit_msg.className = "glyphicon glyphicon-edit"
	edit.appendChild(edit_msg);
	edit.addEventListener(
		'click',
		function(e){
			
			// se oculta todo lo de los comentarios
			$('#title_edit').show()
			$('#list-comment-wiki').hide()
			$('#load-comment-wiki').hide()
			$('.titulos').hide()
			$('.comment').hide()

			// se cambia el titulo en la barra de navegacion
			$('.sub-section').text('Edita la página')
			
			create_form(
				URL_CREATE_PAGE_WIKI,
				$("#form_create_wiki"),
				'OPTIONS',
				call
			);
		}, false);
	$("#wiki_title").append(edit)

	
	//comments
	var comentariosWiki = new CommentView(
		page.thread,
		$("#form-comment-wiki"),
		$('#list-comment-wiki'),
		$(".load-comment-wiki")
	);		
	
	comentariosWiki.load();
	comentariosWiki.load_create_comment(page.thread);

}

function call()
{
	//console.log("form creatted para ");
	var slug = $("#wiki_slug").text();
	//oculta los campos que no se necesitan
	$("#id_slug").remove();
	$("#id_raw").hide();
	$("#id_raw").val($("#markdown").text())

	//asigna el valor actual del titulo al input para el titulo
	$("#id_title").val($("#wiki_title").text())

	//asigna el valor del raw al editor
	//$("#id_textarea").val($("#markdown").text())
	$("#id_textarea").val( $("#wiki_raw").html() )

	//asigna el valor del editor al raw
	$('textarea').keyup(function(e){
		$("#id_raw").val($(e.target).val());
    });

    $('textarea').attr("name", "raw");

	$("#form_create_wiki").show();
	$("#wiki_title").fadeOut();
	$("#markdown").fadeOut();

	$("#form_create_wiki").submit(function(e){
		e.preventDefault();

		
		if ( $("#id_raw").val() == $("#markdown").text())
		{
			//hack para evitar commit con igual id
			$("#id_raw").val($("#id_raw").val()+' ');
		}
		

		var url = URL_UPDATE_PAGE_WIKI.replace(/\%slug%/g, slug);
		WikiService.edit_page(e.target, url,
			function(response){
				$("#form_create_wiki").fadeOut();
				var url = '';

				//dependiendo de los permisos de usuario se muesttra un mensaje u otro
				var s = StorageClass.getInstance();
				if(-1 != s.storage.get("permissions").indexOf("wiki.delete_request")){
					$("#editaded_page_admin").fadeIn();
					//url = WikiModel.generate_url(slug, response.page.slug)
					
					url = Module.getURL(SLUG, "wiki", response.page.slug)
					$("#url_wiki_request_admin").attr('href', url);

				}else
				{
					$("#editaded_page").fadeIn();
					url = response.page.slug+'..'+JSON.parse(response.page.extra_data).parent;
					$("#url_wiki_request").attr('href', url);
				}
				


			})

	});

				
}


WikiView.get_all_Pages = function()
{
	var url = URL_PUBLISHED_PAGE_WIKI_MODULE.replace(/\%slug%/g, slug);
	//URL_GET_LIST_APPROVED_PAGES
	WikiService.get_list(url, WikiView.render_all_pages);
}

WikiView.render_all_pages = function (response)
{
	WikiView.render_list($('.pages'), response);
}

WikiView.render_list = function(parent_container, response)
{

	response = response.results;
	if (response.length === 0) {

		var container = document.createElement("div");
		container.className = 'col-md-12'
		
		$(container).text('No hay páginas creadas')
		parent_container.prepend(container);
		//console.log('no hay páginas')
	};

	for (i = 0; i < response.length; i++) { 		
		// se crea el html   
		//console.log(response[i])  		

		var container = document.createElement("div");
		container.className = 'col-md-12 page_list'

		var br = document.createElement('br')
		var link = document.createElement("a");
		var id = response[i].page.id;
		var slug = response[i].page.slug;
		//$(link).attr('href', host+":"+location.port+"/wiki/"+slug);
		$(link).attr('href', slug);

		var title_page = document.createElement("span");
		$(title_page).css('font-size','18px')
		var date = document.createElement("span");
		date.className = "time-ago";
		//se asigna el texto 
		$(title_page).text(response[i].page.title)
		$(date).text("Última edición "+jQuery.timeago(response[i].author.created_at));

		//se pega a los contenedores 
		link.appendChild(title_page)
		container.appendChild(link);
		container.appendChild(br);
		container.appendChild(date);
		
		parent_container.prepend(container);
	}
}


/* REQUESTS */
WikiView.show_all_request = function(container)
{
	var url = URL_REQUEST_PAGE_WIKI_MODULE.replace(/\%slug%/g, slug);
	//URL_GET_ALL_WIKI_REQUESTeAmosIsabella
	WikiService.get_list(url,
		function  (response) {
			WikiView.render_request(response, container)
		})
}

WikiView.render_request = function(list, global_container)
{
	//console.log(list)
	list = list.results;
	for (i = 0; i < list.length; i++) {

		var id = list[i].id;
		var page = list[i].page;
		var commit = list[i].commit;

		var url = 'create/'+page.slug+'..'+commit;
		

		var container = document.createElement("li");
		
		var div = document.createElement("div");
		div.className = 'col-md-10 page_list'

		var title = document.createElement("span");
		$(title).text(page.title);
		title.className = 'lead';

		var description = document.createElement("span");


		$(description).text(' Esta pagina tiene una solicitud de modificación y espera para ser aprobada ');
		var br = document.createElement('br')
		var link = document.createElement("a");
		
		$(link).attr('href', url);
		
		//se asigna el texto 
		$(link).text("ver")

		div.appendChild(title);
		div.appendChild(br);
		div.appendChild(description);
		div.appendChild(link);
		container.appendChild(div)
		
		global_container.prepend(div);
	}

}

WikiView.approve_succes = function(response)
{
	if(response.slug)
	{
		location.href =  Module.getURL(mod_slug, "/wiki/", response.slug); 
	}
	else
	{
		window.history.back();
	}
	//Notify.show_success("Wiki", response.msg);
}


/*History*/

WikiView.show_all_history = function(container)
{
	var url = URL_HISTORY_PAGE_WIKI_MODULE.replace(/\%slug%/g, slug);;
	//URL_GET_ALL_WIKI_HISTORY
	WikiService.get_list(url , WikiView.render_history)
	WikiView.list_history = container;
}

WikiView.render_history = function(list)
{
	//console.info("WikiView:render_history")
	//console.info(list)
	list = list.results;

	for (i = 0; i < list.length; i++) {

		var id = list[i].id;
		var page = list[i].page;
		var commit = list[i].commit;

		var url = 'create/'+page.slug+'..'+commit;
		

		//var container = document.createElement("li");
		
		var div = document.createElement("div");
		div.className = 'col-md-12 page_list'

		var div_create = document.createElement("div");
		div_create.className = 'col-md-5'

		var div_aprovate = document.createElement("div");
		div_aprovate.className = 'col-md-5'

		var div_title = document.createElement("div");
		div_title.className = 'col-md-12'		

		//var title = document.createElement("span");
		//$(title).text(page.title);
		//title.className = 'lead';

		var description_author = document.createElement("span");
		var description_reviewed = document.createElement("span");
		
		var date = document.createElement("span");
		date.className = "time-ago";
		$(date).text(jQuery.timeago(list[i].author.created_at))

		var date2 = document.createElement("span");
		date2.className = "time-ago";
		$(date2).text(jQuery.timeago(list[i].review.approved.approved_at))

		$(description_author).text('Creado por: '+list[i].author.fullname);
		$(description_reviewed).text('Aprobado por: '+list[i].review.reviewer.fullname);

		var br = document.createElement('br')
		var link = document.createElement("a");
		//link.className = "pull-left"
		$(link).attr('href', url);
		$(link).css('font-size', '20px');
		//se asigna el texto 
		$(link).text(page.title)

		//div.appendChild(title);
		div_title.appendChild(link)
		div.appendChild(div_title);

		div_create.appendChild(description_author);
		div_create.appendChild(br.cloneNode(true));
		div_create.appendChild(date);
		div.appendChild(div_create)
		//div.appendChild(br.cloneNode(true));
		div_aprovate.appendChild(description_reviewed)
		div_aprovate.appendChild(br.cloneNode(true));
		div_aprovate.appendChild(date2);
		
		div.appendChild(div_aprovate)
		//container.appendChild(div)
		
		WikiView.list_history.prepend(div);
	}
}