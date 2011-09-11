Switcher.Targets = function(switcher, options){
	this.options = options;
	this.switcher = switcher;
	
	this.container = $(this.options.container);
	
	this.options.actionType = (typeof this.switcher.options.action == 'string' ? this.switcher.options.action : this.switcher.options.action.type);
	
	this._findItems(switcher.items);
}

Switcher.Targets.prototype = {
	_findItems: function(switcherItems){
		if (this.options.selector) {
			this.items = this.container.find(this.options.selector);
			this.oItems = {};
			
			for (var i = 0, len = switcherItems.length; i < len; i++){
				this.oItems[switcherItems[i]._value] = this._getItemsByValue(switcherItems[i]._value);
			}
		} else {
			this.items = this.container;
		}
	},
	_getItemsByValue: function(value){
		var selector = (this.options.linkPrefix || '') + value + (this.options.linkSuffix || '');

		switch (true) {
			case this.options.linkSource == 'index':
				return this.items.eq(value);
				break;

			case this.options.linkSource == 'id' || this.options.linkAttribute == 'id':
				return this.items.filter('#' + selector);
				break;

			case this.options.linkSource == 'class' || this.options.linkAttribute == 'class':
				return this.items.filter('.' + selector);
				break;

			case this.options.linkSource == 'attribute' || this.options.linkAttribute:
				return this.items.filter('[name~="' + selector + '"]');
				break;
		}
	},

	updateItems: function(value, prevValue){
		switch(true) {
			case this.options.actionType == 'toggleTargets':
				this.items.not(this.oItems[value]).hide();
				this.oItems[value].show();
				break;
				
			case this.options.actionType == 'toggleTargetsClass':
				if (prevValue !== undefined && this.switcher.options.action.addClass)
					this.oItems[prevValue].removeClass(this.switcher.options.action.addClass);
				if (prevValue !== undefined && this.switcher.options.action.removeClass)
					this.oItems[prevValue].addClass(this.switcher.options.action.removeClass);

				if (this.switcher.options.action.removeClass)
					this.oItems[value].removeClass(this.switcher.options.action.removeClass);
				if (this.switcher.options.action.addClass)
					this.oItems[value].addClass(this.switcher.options.action.addClass);
				break;
				
			case this.options.actionType == 'setTargetsValueClass':
				var
					classPrefix = this.switcher.options.action.classPrefix || '',
					classSuffix = this.switcher.options.action.classSuffix || '',
					prevValueClass = classPrefix + prevValue + classSuffix,
					valueClass = classPrefix + value + classSuffix;
			
				this.items
					.removeClass(prevValueClass)
					.addClass(valueClass)
		}
	}
}