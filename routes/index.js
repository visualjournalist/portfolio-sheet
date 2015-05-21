var express = require('express');
var router = express.Router();


/* Splits data into separate paragraphs*/
function splitParagraphs(source){
	var splitGraphs = '';

	var paragraphs = source;
	paragraphs = paragraphs.split('\n')

	for (var i = 0; i<paragraphs.length; i++){
		splitGraphs += '<p>' + paragraphs[i] + '</p>';
	}
	return splitGraphs
}

function splitFirstParagraphs(source){
	var splitGraphs = '';

	var paragraphs = source;
	paragraphs = paragraphs.split('\n')

	for (var i = 0; i<2; i++){
		splitGraphs += '<p>' + paragraphs[i] + '</p>';
	}
	return splitGraphs
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}


/* GET home page. */
router.get('/', function(req, res, next) {
	var featuredNumber = 0;
	if (req.query.number!=null){
		featuredNumber = req.query.number;
	};


	var data = global.site.sitewide;
	var portfolioData = global.portfolio.sitewide;


	var randomProjectNumber = Math.floor(portfolioData.length*Math.random());
	var projectData = portfolioData[randomProjectNumber];
	projectData.descriptionSplit = splitParagraphs(projectData.description);
	var currentCategory = projectData.category;

	var verticalImage = '';
	if (projectData.verticalimage == 'TRUE'){
		verticalImage = 'verticalImage';
	}


	var promos = [];
	for (k=0; k<portfolioData.length; k++){
		if(portfolioData[k].projectnumber!=portfolioData[randomProjectNumber].projectnumber){
			promos.push(portfolioData[k]);
		}
	}

	var url = data[0].url;


	res.render('index', { 
		data: data,
		pageTitle: "Brian Williamson's portfolio",
		portfolioData: promos,
		portfolioDescription: '',
		projectData: projectData,
		verticalImage: verticalImage,
		featuredNumber: featuredNumber,
		category: 'showAll',
		metaImage: data[0].metaimage,
		url: url,
		loopLimit: 6,
		description: splitParagraphs(data[0].biography)
	});
});


/* GET about page. */
router.get('/about', function(req, res, next) {
	var data = global.site.sitewide;
	var portfolioData = global.portfolio.sitewide;
	var url = data[0].url + '/about/';


	res.render('about', { 
		data: data,
		pageTitle: 'About',
		portfolioData: portfolioData,
		portfolioDescription: '',
		url: url,
		description: splitParagraphs(data[0].biography)
	});
});


/* GET portfolio page. Show all. */
router.get('/portfolio/', function(req, res, next) {
	var featuredNumber = req.query.number;

	var data = global.site.sitewide;
	var portfolioData = global.portfolio.sitewide;
	var url = data[0].url + '/portfolio/';


	res.render('portfolio', { 
		data: data,
		pageTitle: "Brian Williamson's portfolio",
		portfolioData: portfolioData,
		portfolioDescription: '',
		featuredNumber: featuredNumber,
		category: 'showAll',
		metaImage: data[0].metaimage,
		url: url,
		loopLimit: portfolioData.length,
		description: splitParagraphs(data[0].biography)
	});
});



/* GET portfolio page. */
router.get('/portfolio/:category/', function(req, res, next) {
	var category = req.params.category;

	if (req.params.category==null){
		category = illustration;
	}

	var pageTitle = "Brian Williamson's " + capitalizeFirstLetter(category) + " portfolio";


	var data = global.site.sitewide;
	var portfolioData = global.portfolio.sitewide;
	var url = data[0].url + '/portfolio/' + category;

	res.render('portfolio', { 
		data: data,
		portfolioData: portfolioData,
		pageTitle: pageTitle,
		portfolioDescription: splitParagraphs(data[0][category]),
		category: category,
		metaImage: data[0].metaimage,
		url: url,
		loopLimit: portfolioData.length,
		description: splitParagraphs(data[0].biography)
	});
});


/* GET project page. */
router.get('/project/:number/', function(req, res, next) {
	var featuredNumber = req.params.number;

	var data = global.site.sitewide;
	var portfolioData = global.portfolio.sitewide;
	var projectData;
	var currentCategory;
	for (var k=0; k<portfolioData.length; k++){
		if(portfolioData[k].projectnumber==featuredNumber){
			projectData = portfolioData[k];
			projectData.descriptionSplit = splitParagraphs(projectData.description);
			currentCategory = projectData.category;
		}
	}
	var verticalImage = '';
	if (projectData.verticalimage == 'TRUE'){
		verticalImage = 'verticalImage';
	}

	var pageTitle = projectData.title;

	var promos = [];
	for (k=0; k<portfolioData.length; k++){
		if(portfolioData[k].category==currentCategory&&portfolioData[k].projectnumber!=featuredNumber){
			promos.push(portfolioData[k]);
		}
	}
	var metaImage = data[0].url + '/images/' + projectData.imagebase + '.jpg';
	var url = data[0].url + '/project/' + featuredNumber;

	res.render('project', { 
		data: data,
		portfolioData: promos,
		projectData: projectData,
		pageTitle: pageTitle,
		portfolioDescription: '',
		featuredNumber: featuredNumber,
		verticalImage: verticalImage,
		category: 'showAll',
		metaImage: metaImage,
		url: url,
		loopLimit: 3,
		description: splitParagraphs(data[0].biography)
	});
});


/* GET blog page. */
router.get('/blog/', function(req, res, next) {
	var data = global.site.sitewide;
	var blogData = global.blog.sitewide;

	for (var j=0; j<blogData.length; j++){
		var splitPost = splitFirstParagraphs(blogData[j].post);
		blogData[j].postSplit = splitPost;
	}
	var url = data[0].url + '/blog/';


	res.render('blog', { 
		data: data,
		blogData: blogData,
		pageTitle: 'Blog',
		portfolioDescription: '',
		metaImage: data[0].metaimage,
		url: url,
		description: splitParagraphs(data[0].biography)
	});
});

/* GET project page. */
router.get('/blog/:number/', function(req, res, next) {
	var featuredNumber = req.params.number;

	var data = global.site.sitewide;
	var blogData = global.blog.sitewide;
	var blogPostData;
	var currentCategory;
	for (var k=0; k<blogData.length; k++){
		if(blogData[k].postnumber==featuredNumber){
			blogPostData = blogData[k];
			blogPostData.descriptionSplit = splitParagraphs(blogPostData.post);
			currentCategory = blogPostData.category;
		}
	}
	var verticalImage = '';
	if (blogPostData.verticalimage == 'TRUE'){
		verticalImage = 'verticalImage';
	}

	var pageTitle = blogPostData.title;
	var metaImage = data[0].url + blogPostData.imagebase;
	var url = data[0].url + '/blog/' + featuredNumber;



	res.render('blogpost', { 
		data: data,
		projectData: blogPostData,
		pageTitle: pageTitle,
		portfolioDescription: '',
		featuredNumber: featuredNumber,
		verticalImage: verticalImage,
		category: 'showAll',
		metaImage: metaImage,
		url: url,
		loopLimit: 3,
		description: splitParagraphs(data[0].biography)
	});
});



module.exports = router;
