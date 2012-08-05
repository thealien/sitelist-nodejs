var config = require('../config').db;
var Sequelize = require('sequelize'),
    db = new Sequelize(config.dbname, config.username, config.password, {
        host: config.host,
        port: config.port,
		define: {
			timestamps:      false,
			freezeTableName: true
		}
	});

var self = module.exports = {
	'db': db,
	
	//
	//
	//
	User: db.define('users', {
		//PRIMARY KEY (`userID`),
		//UNIQUE KEY `username` (`username`),
		//UNIQUE KEY `email` (`email`)
        //`userID` mediumint(8) unsigned NOT NULL AUTO_INCREMENT
        userID: {
			type:           Sequelize.INTEGER,
			autoIncrement:  true,
			primaryKey:     true,
            allowNull:      false
		},
        //`username` varchar(50) DEFAULT NULL,
		username: {
			type:       Sequelize.STRING,
			unique:     true,
			is:         ["^[A-Za-z0-9А-Яа-яёЁ\s-_]+$",'i'],
			len:        [3, 32],
			allowNull: false,
			notEmpty: true
		},
        //`password` varchar(100) DEFAULT NULL,
		password: {
            type:       Sequelize.STRING,
			allowNull:   false,
			notEmpty:    true,
			len:         [3, 32]
		},
        //`email` varchar(150) DEFAULT NULL,
        email: {
            type:       Sequelize.STRING,
            isEmail:    true,
            len:        [3, 150],
            allowNull:   false,
            notEmpty:    true,
            unique: true
        },
        //`role` enum('admin','user') NOT NULL DEFAULT 'user',
		role: {
            type:       Sequelize.STRING,
            allowNull:   false,
            notEmpty:    true,
            defaultValue: 'user',
            oneOfRole: function(value){
                if(!{admin: true, user: true}[value])
                    throw new Error('Invalid role.');
            }
        }
	}, {
        // TODO
		classMethods: {
			staticExample: function(){
				this.name
			}
		}
	}),
	
	//
	//
	//
	Category: db.define('category',{
        //PRIMARY KEY (`id`)

		//`id` int(11) NOT NULL AUTO_INCREMENT,
        id: {
            type:           Sequelize.INTEGER,
            autoIncrement:  true,
            primaryKey:     true,
            allowNull:      false
        },
        //`catname` text NOT NULL,
        catname: {
            type:       Sequelize.TEXT,
            allowNull:  false,
            notEmpty:   true
        },
        //`alias` varchar(45) NOT NULL,
        alias: {
            type:       Sequelize.STRING,
            allowNull:  false,
            notEmpty:   true
        }
	}, {
        classMethods: {
            getRootCats: function(callback){
                // TODO cache it;
                this.findAll({order: 'catname ASC'}).done(function(error, categories){
                    if(error) callback(error);
                    var sqlLinksCount = [
                        "SELECT `catid` AS `c`, COUNT(*) AS `s` ",
                        "FROM `links` `t` ",
                        "WHERE (visible=1) ",
                        "GROUP BY `catid`"
                    ].join('');
                    db.query(sqlLinksCount, null, {raw: true}).done(function(error, result){
                        if(error) callback(error);
                        var linksCountRes = result;
                        var sqlNewLinksCount = [
                            "SELECT `catid` AS `c`, COUNT(*) AS `s` ",
                            "FROM `links` `t` ",
                            "WHERE (visible=1 AND (DATE_SUB(NOW(), INTERVAL 3 DAY)<date)) ",
                            "GROUP BY `catid`"
                        ].join('');
                        db.query(sqlNewLinksCount, null, {raw: true}).done(function(error, result){
                            if(error) callback(error);
                            var newLinksCount = {},
                                linksCount = {};
                            result.forEach(function(v){
                                newLinksCount[v.c] = v.s;
                            });
                            linksCountRes.forEach(function(v){
                                linksCount[v.c] = v.s;
                            });
                            categories.forEach(function(v){
                                if(linksCount[v.id]!== undefined)
                                    v.linksCount = linksCount[v.id];
                                if(newLinksCount[v.id]!== undefined)
                                    v.newLinksCount = newLinksCount[v.id];
                            });
                            callback(null, categories);
                        });
                    });
                });
            }
        }
	}),
	
	//
	//
	//
	Comment: db.define('comments', {
		//`id` int(11) NOT NULL AUTO_INCREMENT,
        id: {
            type:           Sequelize.INTEGER,
            autoIncrement:  true,
            primaryKey:     true,
            allowNull:      false
        },
        //`linkid` int(11) DEFAULT NULL,
        linkid: {
            type:           Sequelize.INTEGER,
            allowNull:      false
        },
        //`text` mediumtext NOT NULL,
        text: {
            type:       Sequelize.TEXT,
            allowNull:  false,
            notEmpty:   true
        },
        //`user` text NOT NULL,
        user: {
            type:           Sequelize.STRING,
        },
        //`userid` int(11) NOT NULL,
        userid: {
            type:           Sequelize.INTEGER,
            allowNull:      false
        },
        //`ip` text NOT NULL,
        ip: {
            type:           Sequelize.STRING,
            isIP:           true,
            allowNull:      false
        },
        //`datetime` datetime NOT NULL,
        datetime: {
            type: Sequelize.DATE,
            allowNull:      false
        }
	}, {
		
	}),
	
	//
	//
	//
	Favorite: db.define('favs', {
		//`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
        //`title` varchar(255) NOT NULL,
        //`desc` mediumtext NOT NULL,
        //`user_id` int(10) unsigned NOT NULL,
        //PRIMARY KEY (`id`),
	}, {
		
	}),
	
	//
	//
	//
	Link: db.define('links', {
        //PRIMARY KEY (`id`)

		//`id` int(11) NOT NULL AUTO_INCREMENT,
        id: {
            type:           Sequelize.INTEGER,
            autoIncrement:  true,
            primaryKey:     true,
            allowNull:      false
        },
		//`url` varchar(255) NOT NULL,
        url:{
            type:       Sequelize.STRING,
            allowNull:  false,
            notEmpty:   true
        },
		//`catid` int(11) NOT NULL,
        catid: {
            type:           Sequelize.INTEGER,
            allowNull:      false
        },
		//`title` text,
        title: {
            type: Sequelize.TEXT,
            allowNull:  false,
            notEmpty:   true
        },
		//`desc` mediumtext NOT NULL,
        desc: {
            type: Sequelize.TEXT,
            allowNull:  false,
            notEmpty:   true
        },
		//`foto` varchar(255) NOT NULL,
        foto: {
            type: Sequelize.STRING
        },
		//`userid` int(11) NOT NULL,
        userid: {
            type: Sequelize.INREGER
        },
		//`visible` tinyint(1) NOT NULL DEFAULT '0',
        visible: {
            type: Sequelize.BOOLEAN,
            allowNull:  false,
            defaultValue: false
        },
		//`ip` text NOT NULL,
        ip: {
            type:   Sequelize.STRING,
            isIP: true
        },
		//`rate` int(11) NOT NULL,
        rate: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
		//`votes` int(11) NOT NULL,
        votes: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
		//`date` datetime NOT NULL,
        date: {
            type: Sequelize.DATETIME,
            allowNull: false
        },
		//`pr` int(2) NOT NULL COMMENT 'Google PR',
        pr: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
		//`ci` int(15) NOT NULL COMMENT 'Яндекс ТИЦ',
        ci: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
		//`pr_lastdate` int(15) NOT NULL DEFAULT '0',
        pr_lastdate: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
		//`ci_lastdate` int(15) NOT NULL DEFAULT '0',
        ci_lastdate: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
		//`date_ts` int(10) unsigned NOT NULL,
        date_ts: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
		//`domain` varchar(255) NOT NULL,
        domain: {
            type: Sequelize.STRING,
            allowNull: false
        },
		//`broken` tinyint(1) NOT NULL DEFAULT '0',
        broken: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
	}, {
		classMethods: {
            getLastLinks: function(callback, limit){
                limit = parseInt(limit, 10) || 3;
                this.findAll({
                    where: {
                        visible: true
                    },
                    order: 'id DESC',
                    limit: limit
                }).done(callback);
            }
        },

        instanceMethods: {
            isNew: function(){
                return (+(new Date())/1000 - this.date_ts)<(259200);
            }
        }
	}),
	
	//
	//
	//
	Profile: db.define('profile', {
		//`user_id` int(10) unsigned NOT NULL,
		//`birthday` varchar(10) NOT NULL,
		//`site` varchar(255) NOT NULL,
		//`skype` varchar(100) NOT NULL,
		//`icq` varchar(15) NOT NULL,
		//`from` varchar(255) NOT NULL,
		//`avatar` varchar(45) NOT NULL,
		//PRIMARY KEY (`user_id`)
	}, {
		
	}),
	
	//
	//
	//
	Tag: db.define('tags', {
		//`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
		//`name` varchar(255) NOT NULL,
		//PRIMARY KEY (`id`),
		//UNIQUE KEY `name_IDX` (`name`)		
	}, {
		
	}),
	
	//
	//
	//
	Token: db.define('tokens', {
		//`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
		//`user_id` int(10) unsigned NOT NULL,
		//`type` varchar(32) NOT NULL,
		//`code` varchar(32) NOT NULL,
		//`date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		//`ip` varchar(15) NOT NULL,
		//PRIMARY KEY (`id`),
		//UNIQUE KEY `code_IDX` (`code`),		
	}, {
		
	}),
	
	//
	//
	//
	Vote: db.define('votes', {
		//`link_id` int(11) NOT NULL,
		//`ip` varchar(15) NOT NULL,
		//`date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		//`vote` enum('1','-1') NOT NULL,
		//`user_id` int(10) unsigned NOT NULL DEFAULT '0',		
	}, {
		
	})
};

































