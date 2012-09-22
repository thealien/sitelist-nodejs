var models = require('../models'),
    util = require('util'),
    LinkPager = require('../views/widgets/LinkPager.js');

var pager = LinkPager.create(20, 10);
var pagerUsers = LinkPager.create(30, 10);

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
    console.log(req.params);
    var page = parseInt(req.params.page, 10) || 1;
    var limit = 20;
    models.Category.find(id).done(function(error, category){
        if (!category) {
            res.send(404);
            return;
        }
        var where = {
            catid: category.id,
            visible: true
        }
        models.Link.count({where: where}).ok(function(count){
            models.Link.findAll({
                where: where,
                order: 'id DESC',
                offset: limit * (page-1),
                limit: limit
            }).done(function(error, links){
                    category.links = links;
                    category.linksCount = links.length || 0;
                    res.render('category/view', {
                        title: category.catname,
                        category: category,
                        page: page,
                        pagination: pager.build({
                            currentPage:    page,
                            itemsCount:     count,
                            urlPrefix:      util.format('/category/%d/dev/', category.id),
                            urlPostfix:     ''
                        })
                    });
                });
        });
    });
}

// Top links
exports.top = function(req, res, next){
    var page = parseInt(req.params.page, 10) || 1;
    var limit = 20;
    models.Link.count({where: { visible: true }}).ok(function(count){
        models.Link.findAll({
            where: { visible: true },
            order: 'rate DESC',
            offset: limit * (page-1),
            limit: limit
        }).done(function(error, links){
                if(error || links.length< 1){
                    res.send(404); return;
                }
                res.render('main/top', {
                    title: 'Рейтинг сайтов',
                    links: links,
                    page: page,
                    pagination: pager.build({
                        currentPage:    page,
                        itemsCount:     count,
                        //urlFormat:      '/top/#page#/'
                        //url: '/top?test=qwe'
                        urlPrefix:      '/top/',
                        urlPostfix:     ''
                    })
                });
            });
    });
}

// Last links
exports.new = function(req, res, next){
    var page = parseInt(req.params.page, 10) || 1;
    var limit = 20;
    models.Link.count({where: { visible: true }}).ok(function(count){
        models.Link.findAll({
            where: { visible: true },
            order: 'id DESC',
            offset: limit * (page-1),
            limit: limit
        }).done(function(error, links){
                if(error || links.length< 1){
                    res.send(404); return;
                }
                res.render('main/new', {
                    title: 'Рейтинг сайтов',
                    links: links,
                    page: page,
                    pagination: pager.build({
                        currentPage:    page,
                        itemsCount:     count,
                        urlPrefix:      '/new/',
                        urlPostfix:     ''
                    })
                });
            });
    });
}

// Users
exports.users = function(req, res, next){
    var page = parseInt(req.params.page, 10) || 1;
    var limit = 30;
    models.User.count().ok(function(count){
        models.User.getAll(
            limit*(page-1),
            limit,
            'DESC',
            function(error, users){
                if(error){
                    res.send(404); return;
                }
                res.render('main/users', {
                    title: 'Пользователи',
                    users: users,
                    page: page,
                    pagination: pagerUsers.build({
                        currentPage:    page,
                        itemsCount:     count,
                        urlPrefix:      '/users/',
                        urlPostfix:     ''
                    })
                });
            }
        );
    });
}


