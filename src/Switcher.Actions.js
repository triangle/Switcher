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
	this.forwardAddClass = options.addClass || options.forwardAddClass;
	this.forwardRemoveClass = options.removeClass || options.forwardRemoveClass;
	this.reverseAddClass = options.removeClass || options.reverseAddClass;
	this.reverseRemoveClass = options.addClass || options.reverseRemoveClass;
}

Switcher.Action.ToggleClass.prototype = {
	reverse: function(targets) {
		if (targets && this.reverseRemoveClass) targets.removeClass(this.reverseRemoveClass);
		if (targets && this.reverseAddClass) targets.addClass(this.reverseAddClass);
	},
	forward: function(targets, value) {
		if (targets && this.forwardRemoveClass) targets.removeClass(this.forwardRemoveClass);
		if (targets && this.forwardAddClass) targets.addClass(this.forwardAddClass);
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
		this.reverse(this.getTargets(this.switcher.prevSelectedValue), null, false, function(){
			oThis.forward(oThis.getTargets(oThis.switcher.selectedValue));
		})
	},
	reverse: function(targets, value, quick, callback) {
		if (targets) {
			if (!quick) {
				this.switcher._lock();
				targets.fadeOut(this.duration, this.easing, callback || $.proxy(this.switcher, "_unlock"));
			} else {
				targets.hide();
			}
		}
	},
	forward: function(targets, value) {
		if (targets) {
			this.switcher._lock();
			targets.fadeIn(this.duration, this.easing, $.proxy(this.switcher, "_unlock"));
		}
	}
}