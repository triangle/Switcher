var Switcher = {};



Function.prototype.scope = function(o){
	var fn = this;
	return function(){
		return fn.apply(o, arguments);
	};
};



Switcher.utils = {
	getSuffixClass: function(el, prefix) {
		if($(el).length){
			var classNames = $(el).attr('class').split(' ');
			for (var i = 0; i < classNames.length; i++) {
				if (prefix == classNames[i].substr(0, prefix.length)) {
					return classNames[i].substr(prefix.length);
				}
			}
		}
		return false;
	}
}