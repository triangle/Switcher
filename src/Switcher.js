var Switcher = {};



Function.prototype.scope = function(o){
	var fn = this;
	return function(){
		return fn.apply(o, arguments);
	};
};



Switcher.utils = {
	extend: function extend(subClass, superClass) {
	  var F = function() {};
	  F.prototype = superClass.prototype;
	  subClass.prototype = new F();
	  subClass.prototype.constructor = subClass;

	  subClass.superClass = superClass.prototype;
	  if(superClass.prototype.constructor == Object.prototype.constructor) {
	    superClass.prototype.constructor = superClass;
	  }
	},
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