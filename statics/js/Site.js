var Site = function()
{

}

Site.geRootUrl = function()
{
	var http = location.protocol;
	var slashes = http.concat("//");
	var host = slashes.concat(window.location.hostname);
	var root = host+(location.port ? ':'+location.port: '');
	return root;
}

Site.getPermissionsUrl = function()
{
	var url = Site.geRootUrl() + '/p';
	console.log(url)
	return url;
}