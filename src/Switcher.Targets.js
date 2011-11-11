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
		switch(true) {
			case this.options.actionType == 'toggle':
			case this.options.actionType == 'toggleClass':
			case this.options.actionType == 'setValueClass':
				var execute = this.actions[this.options.actionType].execute;
				if (execute && typeof execute === 'function') {
					execute(value, prevValue);
				} else {
					this.itemActionReverse(prevValue);
					this.itemActionForward(value);
				}
				break;
				
			case this.options.actionType == 'fade':
				$.proxy(this.actions.fade.reverse, this)(prevValue,	function(){
					$.proxy(switcher.targets.actions.fade.forward, switcher.targets)(value);
				});
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
			reverse: function(value) {
				this.oItems[value].hide();
			},
			forward: function(value) {
				this.oItems[value].show();
			}
		},
		
		toggleClass: {
			reverse: function(value) {
				this.actions.toggleClass._helper(this.oItems[value], this.switcher.options.action.addClass, this.switcher.options.action.removeClass);
			},
			forward: function(value) {
				this.actions.toggleClass._helper(this.oItems[value], this.switcher.options.action.removeClass, this.switcher.options.action.addClass);
			},
			_helper: function(items, removeClass, addClass) {
				if (items && removeClass) items.removeClass(removeClass);
				if (items && addClass)items.addClass(addClass);
			}
		},
		
		setValueClass: {
			reverse: function(value) {
				this.jItems.removeClass((this.switcher.options.action.classPrefix || '') + value + (this.switcher.options.action.classSuffix || ''));
			},
			forward: function(value) {
				this.jItems.addClass((this.switcher.options.action.classPrefix || '') + value + (this.switcher.options.action.classSuffix || ''));
			} 
		},
		
		fade: {
			reverse: function(value, callback) {
				if (this.oItems[value]) {
					this.switcher._lock();
					this.oItems[value].fadeOut(this.switcher.options.action.fadeDuration, this.switcher.options.action.fadeEasing, callback || $.proxy(this.switcher, "_unlock"));
				}
			},
			forward: function(value) {
				if (this.oItems[value]) {
					this.switcher._lock();
					this.oItems[value].fadeIn(this.switcher.options.action.fadeDuration, this.switcher.options.action.fadeEasing, $.proxy(this.switcher, "_unlock"));
				}
			}
		}
	}
}