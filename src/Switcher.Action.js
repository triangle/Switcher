Switcher.Action = function(switcher, options) {
	var	action;
	
	switch (typeof options == 'string' ? options : options.type) {
		case 'toggle':
			action = new Switcher.Action.Toggle(options);
			break;
		case 'toggleClass':
			action = new Switcher.Action.ToggleClass(options);
			break;
		case 'setValueClass':
			action = new Switcher.Action.SetValueClass(options);
			break;
		case 'fade':
			action = new Switcher.Action.Fade(options);
			break;
	}
	$.extend(this, action);
	
	this.switcher = switcher;
}
Switcher.Action.prototype = {
	execute: function() {
		this.reverse(this.getTargets(this.switcher.prevSelectedValue), this.switcher.prevSelectedValue);
		this.forward(this.getTargets(this.switcher.selectedValue), this.switcher.selectedValue);
	},
	getTargets: function(value) {
		return this.switcher.targets.oItems[value];
	},
	_reverse: function(value, quick) {
		this.reverse(this.getTargets(value), value, quick);
	},
	_forward: function(value) {
		this.forward(this.getTargets(value), value);
	}
}