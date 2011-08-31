var Switcher = {};



Function.prototype.scope = function(o){
	var fn = this;
	return function(){
		return fn.apply(o, arguments);
	};
};