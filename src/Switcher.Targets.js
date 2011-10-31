Switcher.Targets = function(switcher, options){
	if (typeof options == 'string') {
		options = {
			selector: options
		}
	}
	this.options = options;
	this.switcher = switcher;
	
	this.options.container = this.options.container || '';
	
	this.options.actionType = (typeof this.switcher.options.action == 'string' ? this.switcher.options.action : this.switcher.options.action.type);
	
	this._findItems(switcher.items);
}

Switcher.Targets.prototype = {
	_findItems: function(switcherItems){
		if (this.options.selector) {
			this.jItems = $(this.options.container + ' ' + this.options.selector);
			this.oItems = {};
			
			for (var i = 0, len = switcherItems.length; i < len; i++){
				this.oItems[switcherItems[i]._value] = this._getItemsByValue(switcherItems[i]._value);
			}
		} else {
			this.jItems = $(this.options.container);
		}
	},
	_getItemsByValue: function(value){
		var selector = (this.options.linkPrefix || '') + value + (this.options.linkSuffix || '');

		switch (true) {
			case this.options.linkSource == 'id' || this.options.linkAttribute == 'id':
				return this.jItems.filter('#' + selector);
				break;

			case this.options.linkSource == 'class' || this.options.linkAttribute == 'class':
				return this.jItems.filter('.' + selector);
				break;

			case this.options.linkSource == 'attribute' || (this.options.linkAttribute !== undefined && this.options.linkAttribute != ''):
				return this.jItems.filter('[' + this.options.linkAttribute + '~="' + selector + '"]');
				break;
			
			case this.options.linkSource == 'index':
			default:
				return this.jItems.eq(value);
				break;
		}
	},

	updateItems: function(value, prevValue, switcher){
		console.log(this);
		
		switch(true) {
			case this.options.actionType == 'toggle':
				this.actions.toggle.execute(value, prevValue);
				break;
				
			case this.options.actionType == 'toggleClass':
				if (prevValue !== undefined && this.switcher.options.action.addClass)
					this.oItems[prevValue].removeClass(this.switcher.options.action.addClass);
				if (prevValue !== undefined && this.switcher.options.action.removeClass)
					this.oItems[prevValue].addClass(this.switcher.options.action.removeClass);

				if (this.switcher.options.action.removeClass)
					this.oItems[value].removeClass(this.switcher.options.action.removeClass);
				if (this.switcher.options.action.addClass)
					this.oItems[value].addClass(this.switcher.options.action.addClass);
				break;
				
			case this.options.actionType == 'setValueClass':
				var
					classPrefix = this.switcher.options.action.classPrefix || '',
					classSuffix = this.switcher.options.action.classSuffix || '',
					prevValueClass = classPrefix + prevValue + classSuffix,
					valueClass = classPrefix + value + classSuffix;
			
				this.jItems
					.removeClass(prevValueClass)
					.addClass(valueClass)
				break;
				
			case this.options.actionType == 'fade':
				if (this.oItems[prevValue]) {
					switcher._lock();
					this.oItems[prevValue].fadeOut(switcher.options.action.fadeDuration, switcher.options.action.fadeEasing, $.proxy(function(){
						this.oItems[value].fadeIn(switcher.options.action.fadeDuration, switcher.options.action.fadeEasing, $.proxy(switcher, "_unlock"));
					}, this));
				}
				break;
		}
	},
	
	itemActionReverse: function(value) {
		$.proxy(this.actions[this.options.actionType].reverse, this)(value);
	},
	itemActionForward: function(value) {
		$.proxy(this.actions[this.options.actionType].forward, this)(value);
	},
	
	actions: {
		toggle: {
			execute: function(value, prevValue) {
				this.actions.toogle.reverse(prevValue);
				this.actions.toogle.forward(value);
			},
			reverse: function(value) {
				this.oItems[value].hide();
			},
			forward: function(value) {
				this.oItems[value].show();
			}
		}
	}
}