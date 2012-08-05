var models = require('../models');

// Main page
exports.index = function(req, res){
    models.Category.getRootCats(function(error, categories){
        res.render('main/index', {
            categories: categories
        });
    });
};

// About
exports.about = function(req, res){
    res.render('main/about');
};

// Feedback
exports.feedback = function(req, res){
    res.render('main/feedback');
};

// Category
exports.category = function(req, res, next){
    var id = parseInt(req.params.id, 10);
    models.Category.find(id).done(function(error, category){
        if (!category) {
            res.send(404);
            return;
        }
        models.Link.findAll({
            where: {
                catid: category.id,
                visible: true
            },
            order: 'id DESC'
        }).done(function(error, links){
            category.links = links;
            category.linksCount = links.length || 0;
            res.render('category/view', {
                title: category.catname,
                category: category
            });
        });
    });
}

// Top links
exports.top = function(req, res, next){
    var page = parseInt(req.params.page, 10) || 1;
    var limit = 20;
    models.Link.findAll({
        where: { visible: true },
        order: 'rate DESC',
        offset: limit * (page-1),
        limit: limit
    }).done(function(error, links){
            if(links.length< 1){
                res.send(404); return;
            }
            res.render('main/top', {
                title: 'Рейтинг сайтов',
                links: links,
                page: page
            });
        });
}

// Last links
exports.new = function(req, res, next){
    var page = parseInt(req.params.page, 10) || 1;
    var limit = 20;
    models.Link.findAll({
        where: { visible: true },
        order: 'id DESC',
        offset: limit * (page-1),
        limit: limit
    }).done(function(error, links){
            if(links.length< 1){
                res.send(404); return;
            }
            res.render('main/new', {
                title: 'Рейтинг сайтов',
                links: links,
                page: page
            });
        });
}

// Users


