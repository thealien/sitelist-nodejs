exports.word_ending = function (value, forms, onlyWord) {
    if (value === undefined) return '';
    if (typeof expr !== 'object') {
        forms = forms.split(' ').map(function (value) {
            return ('' + value).trim();
        });
    }
    var n = parseInt(value, 10);
    var index = ~-(n/10%10)?698706>>n%10*2&3:2
    return ''+ (onlyWord ? '' : value+' ' ) + forms[index];
}

exports.nlbr =  function(s){
    return (''+s).replace("\n", '<br>');
}

exports.nldiv = function(s){
	return (''+s).replace("\n", '<br class="br">');
}
    
exports.cut = function cut(s, l){
	l = parseInt(l, 10);
	l = l || 80;
	s = ''+s;
    return (s.length > l) ? (s.substr(0, l)+'...') : s;
}

exports.rateFormat = function(rate){
    return ( rate>0?'+':'' ) + rate;
}