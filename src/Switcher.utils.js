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
	getValueFromAttribute: function(el, sAttrName, valueTemplate) {
		var el = $(el);
		if(el.length){
			var
				aAttrValues = [],
				rValue = new RegExp(valueTemplate.replace('%', '(.+)'));
			if (sAttrName != 'id'){
				aAttrValues = el.attr(sAttrName).split(' ')
			} else {
				aAttrValues.push(el.attr(sAttrName));
			}
			for (var i = 0, len = aAttrValues.length; i < len; i++) {
				var m = rValue.exec(aAttrValues[i]);
				if (m){
					return m[1];
				}
			}
		}
		return false;
	}
}