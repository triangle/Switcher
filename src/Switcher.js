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
	getValueFromAttribute: function(el, sAttrName, prefix, suffix) {
		var el = $(el);
		if(el.length){
			var aAttrValues = [];
			if (sAttrName != 'id'){
				aAttrValues = el.attr(sAttrName).split(' ')
			} else {
				aAttrValues.push(el.attr(sAttrName));
			}
			for (var i = 0, len = aAttrValues.length; i < len; i++) {
				if (
						(!prefix || prefix && aAttrValues[i].indexOf(prefix) == 0)
						&& (!suffix || suffix && aAttrValues[i].substr(aAttrValues[i].length - suffix.length) == suffix)
				){
					return aAttrValues[i].slice(prefix ? prefix.length : 0, aAttrValues[i].length - (suffix ? suffix.length : 0));
				}
			}
		}
		return false;
	}
}