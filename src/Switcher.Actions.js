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
		if (targets && this.addClass) targets.removeClass(this.addClass);
		if (targets && this.removeClass) targets.addClass(this.removeClass);
	},
	forward: function(targets, value) {
		if (targets && this.removeClass) targets.removeClass(this.removeClass);
		if (targets && this.addClass) targets.addClass(this.addClass);
	}
}


Switcher.Action.SetValueClass = function(options){
	this.classTemplate = options.classTemplate || '%'; 
}

Switcher.Action.SetValueClass.prototype = {
	reverse: function(targets, value) {
		targets && targets.removeClass(this.classTemplate.replace(/%/g, value));
	},
	forward: function(targets, value) {
		targets && targets.addClass(this.classTemplate.replace(/%/g, value));
	},
	getTargets: function() {
		return this.switcher.targets.jItems;
	}
}


Switcher.Action.Fade = function(options) {
	this.easing = options.fadeEasing;
	this.duration = options.fadeDuration;
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
			targets.fadeOut(this.duration, this.easing, callback || $.proxy(this.switcher, "_unlock"));
		}
	},
	forward: function(targets, value) {
		if (targets) {
			this.switcher._lock();
			targets.fadeIn(this.duration, this.easing, $.proxy(this.switcher, "_unlock"));
		}
	}
}