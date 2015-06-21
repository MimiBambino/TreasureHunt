var headerName = "<h1 id='name' class='analgous-color'>%data%</h1>";
var headerRole = "<h4 id='role' class='contrasting1-color'>%data%</h4>";
var headerContacts = "<div class='container'><div class='row'><div class='contactBar col-md-12'><ul class='nav nav-pills navbar-center'><li><a target='_blank' href='https://www.github.com/%github%' class='icon icon-github'></a></li><li><a target='_blank' href='http://www.linkedin.com/pub/cynthia-o-donnell/a2/719/7a0/' class='icon icon-linkedin'></a></li><li><a target='_blank' href='http://www.twitter.com/mimibambino' class='icon icon-twitter'></a></li><li><a href='mailto:%email%' class='icon icon-mail'></a></li><li><a target='_blank' href='http://%website%' class='icon icon-link'></a></li></ul></div></div></div>";

var projectName = "<h4 id='project'>%data%</h4>";

var contactLocation = "<li class='contact-type'>location: <span class='contact-data'>%data%</span></li>";
var contactWebsite = "<li class='contact-type'>website: <span class='contact-data'><a target='_blank' href='http://%data%'>%data%</a></span></li>";
var contactEmail = "<li class='contact-type'>email: <span class='contact-data'><a href='mailto:%data%'>%data%</a></span></li>";
var contactTwitter = "<li class='contact-type'>twitter: <span class='contact-data'><a target='_blank' href='http://www.twitter.com/mimibambino'>%data%</a></span></li>";
var contactGithub = "<li class='contact-type'>github: <span class='contact-data'><a target='_blank' href='https://www.github.com/%data%'>%data%</a></span></li>";
var contactLinkedIn = "<li class='contact-type'>linkedin: <span class='contact-data'><a target='_blank' href='http://www.linkedin.com/pub/cynthia-o-donnell/a2/719/7a0/'>%data%</a></span></li>";

var bio = {
	"name": "Cynthia O'Donnell",
	"project": "Treasure Hunt",
	"contacts": {
		"website" : "www.cynthiaodonnell.com", 
		"email" : "mimibambino@gmail.com",
		"twitter" : "@mimibambino",
		"github" : "MimiBambino",
		"linkedin" : "Cynthia O'Donnell",
	},
	"displayHeader": function(){
		var formattedName = headerName.replace("%data%", bio.name);
		var formattedRole = headerRole.replace("%data%", bio.role);
		$("header").append(projectName.replace("%data%", bio.project));
		$("header").append(formattedName);
		var formattedContactBar = headerContacts.replace("%website%", bio.contacts["website"]).replace("%email%", bio.contacts["email"]).replace("%github%", bio.contacts["github"]);
		$("header").append(formattedContactBar);
	}
};

bio.displayHeader();
