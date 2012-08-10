function LinkPager(itemsPerPage, linksCount, renderConfig){
    this.options = {
        itemsPerPage:   parseInt(itemsPerPage, 10) || 10,
		linksCount:     parseInt(linksCount, 10) || 10,
	}
	this.renderConfig = renderConfig || {};
}

LinkPager.prototype.configure = function(config){
	var options = this.options;
    var currentPage = config.currentPage || 1;
	var itemsCount = config.itemsCount || 1;
	var firstPage = 1;
	var lastPage = Math.ceil(itemsCount/options.itemsPerPage);
	var linksCount = Math.min(options.linksCount, lastPage);
	var prevPage = (currentPage-1) || currentPage;
	var nextPage = Math.min(lastPage, currentPage+1);

    this.config = {
        currentPage:    currentPage,
        itemsCount:     itemsCount,
        firstPage:      firstPage,
        lastPage:       lastPage,
        linksCount:     linksCount,
        prevPage:       prevPage,
        nextPage:       nextPage
    };

	var urlPrefix =    config.urlPrefix || '';       //  http://site.com/items/
	var urlPostfix =   config.urlPostfix || '';      //  /print
    var urlFirst =     config.urlFirst || urlPrefix;       //  http://site.com/items/
	var urlFormat =    config.urlFormat || '';       //  http://site.com/items/#page#/print
	
	this.urlConfig = {
		urlPrefix:    urlPrefix,
		urlPostfix:   urlPostfix,
        urlFirst:     urlFirst,
		urlFormat:    urlFormat
	}

	return this;
}

LinkPager.prototype.render = function(config){
	if(config) this.configure(config);
    var c = this.config;
    var u = this.urlConfig;
    var o = this.options;
    function createUrl(page){
        page = parseInt(page, 10);
        var url;
        if(page == 1){
            url = u.urlFirst;
        } else {
            url = u.urlPrefix + page + u.urlPostfix;
        }
        return url;
    }

    var html = [];
    html.push('<ul id="yw0" class="yiiPager">');

    var cls = '';
    if(c.currentPage == c.firstPage){
        cls = ' hidden';
    }
    html.push('<li class="first'+cls+'"><a href="'+createUrl(1)+'">начало</a></li>');
    html.push('<li class="previous'+cls+'"><a href="'+createUrl(c.prevPage)+'">&larr;</a></li>');

    var firstStep = Math.max(1, c.currentPage - Math.ceil(o.linksCount/2));
    for(var i=firstStep; i <= c.linksCount; i++){
        var selected = (i==c.currentPage) ? ' selected' : '';
        html.push('<li class="page'+selected+'"><a href="'+createUrl(i)+'">'+i+'</a></li>');
    }
    html.push('<li class="next"><a href="'+createUrl(c.nextPage)+'">&rarr;</a></li>');
    html.push('<li class="last"><a href="'+createUrl(c.lastPage)+'">в конец</a></li>');

    html.push('</ul>');
    return html.join(' ');
}

exports.create = function(itemsPerPage, linksCount, renderConfig){
    return new LinkPager(itemsPerPage, linksCount, renderConfig);
}