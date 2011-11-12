Switcher.Action.Toggle = function() {}

Switcher.Action.Toggle.prototype = {
	reverse: function(targets) {
		targets && targets.hide();
	},
	forward: function(targets) {
		targets && targets.show();
	}
}


Switcher.Action.ToggleClass = function(options) {
	this.addClass = options.addClass;
	this.removeClass = options.removeClass;
}

Switcher.Action.ToggleClass.prototype = {
	reverse: function(targets) {
		this._helper(targets, this.addClass, this.removeClass);
	},
	forward: function(targets, value) {
		this._helper(targets, this.removeClass, this.addClass);
	},
	_helper: function(items, removeClass, addClass) {
		if (items && removeClass) items.removeClass(removeClass);
		if (items && addClass)items.addClass(addClass);
	}
}


Switcher.Action.SetValueClass = function(options){
	this.classPrefix = options.classPrefix || '';
	this.classSuffix = options.classSuffix || '';
}

Switcher.Action.SetValueClass.prototype = {
	reverse: function(targets, value) {
		targets && targets.removeClass(this.classPrefix + value + this.classSuffix);
	},
	forward: function(targets, value) {
		targets && targets.addClass(this.classPrefix + value + this.classSuffix);
	},
	getTargets: function() {
		return this.switcher.targets.jItems;
	}
}


Switcher.Action.Fade = function(options) {
	this.fadeEasing = options.fadeEasing;
	this.fadeDuration = options.fadeDuration;
}

Switcher.Action.Fade.prototype = {
	execute: function() {
		var oThis = this;
		this.reverse(this.getTargets(this.switcher.prevSelectedValue), null, function(){
			oThis.forward(oThis.getTargets(oThis.switcher.selectedValue));
		})
	},
	reverse: function(targets, value, callback) {
		if (targets) {
			this.switcher._lock();
			targets.fadeOut(this.fadeDuration, this.fadeEasing, callback || $.proxy(this.switcher, "_unlock"));
		}
	},
	forward: function(targets, value) {
		if (targets) {
			this.switcher._lock();
			targets.fadeIn(this.fadeDuration, this.fadeEasing, $.proxy(this.switcher, "_unlock"));
		}
	}
}