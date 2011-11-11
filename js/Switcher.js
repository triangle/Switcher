/*
 * Switcher v0.33
 * 
 * Requires jQuery
 */
var Switcher = function(options){
	return new Switcher.Basic(options);
};
Switcher.Basic = function(options){
	if (typeof options.items == 'string') {
		options.items = {
			selector: options.items
		}
	}
	this.options = $.extend(true, {}, this.defaultOptions, options); 
	
	this._findItems();
	this._attachCallback();
	
	if (this.options.targets) {
		this.targets = new Switcher.Targets(this, this.options.targets)
	}
}

Switcher.Basic.prototype = {
	_findItems: function(){
		var oThis = this;
		this.items = [];
		
		this.jItems = $(this.options.items.selector); 
		
		this.jItems.each(function(){
			var newItem = new Switcher.SwitcherItem({
				element: this,
				switcher: oThis,
				itemsOptions: oThis.options.items
			});
			oThis.items.push(newItem);
			
			if (!oThis.selectedItem && newItem.isSelected()){
				oThis.selectedItem = newItem;
			} 
		});
	},
	_attachCallback: function(){
		if (this.options.onSelect && typeof this.options.onSelect === 'function') {
			this.onSelect = $.proxy(this.options.onSelect, this);
		}
	},
	_setSelectedItem: function(item){
		this._clearSelectedItem();

		this.selectedItem  = item;
		this.selectedValue = item._value;
	},
	_clearSelectedItem: function(){
		if (this.selectedItem) {
			this.prevSelectedItem  = this.selectedItem;
			this.prevSelectedValue = this.selectedItem._value;
		}
		this.selectedItem  = null;
		this.selectedValue = null
	},
	_invokeCallbacks: function(){
		if (this.targets) {
			this.targets.updateItems(this.selectedValue, this.prevSelectedValue, this);
		}
		
		if (this.onSelect) {
			this.onSelect();
		}		
	},
	_lock: function(){
		this.isLocked = true;
	},
	_unlock: function(){
		this.isLocked = false;
	},
	
	action: function(item){
		if (!this.options.multiselect) {
			if (this.isLocked || item.isSelected()) return;
			
			this.deselectSelectedItem();
			
			item.select();
			this._setSelectedItem(item);
			
			this._invokeCallbacks();
		} else {
			if (this.isLocked) return;
			
			if (item.isSelected()) {
				item.deselect();
				if (this.targets) {
					this.targets.itemActionReverse(item._value);
				}
			} else {
				item.select();
				if (this.targets) {
					this.targets.itemActionForward(item._value);
				}
			}
		}
	},
	deselectSelectedItem: function(){
		if (this.selectedItem) {
			this.selectedItem.deselect();
		}
	},
	deselectAllItems: function(){
		for (var i = 0, num = this.items.length; i < num; i++){
			this.items[i].deselect();
		}
	},

	defaultOptions: {
		items: {
			selector: '.switcher-item',
			selectedClass: 'selected',
			valueSource: 'index',
			event: 'click'
		},
		multiselect: false
	}
}
Switcher.SwitcherItem = function(options){
	this._element = $(options.element);
	
	this.options = options.itemsOptions;
	
	this._setValue(options.switcher);
	this._attachEvents(options.switcher);
	
}

Switcher.SwitcherItem.prototype = {
	_setValue: function(switcher){
		switch (true) {
			case this.options.valueSource == 'id' || this.options.valueAttribute == 'id':
			case this.options.valueSource == 'class' || this.options.valueAttribute == 'class':
			case this.options.valueSource == 'attribute' || (this.options.valueAttribute !== undefined && this.options.valueAttribute != ''):
				this._value = Switcher.utils.getValueFromAttribute(
					this._element,
					this.options.valueAttribute || this.options.valueSource,
					this.options.valuePrefix,
					this.options.valueSuffix
				);
				break;
			
			case this.options.valueSource == 'index':
				this._value = switcher.items.length;
				break;
		}
	},
	_attachEvents: function(switcher){
		var eventElement = this._element;
		if (this.options.eventElement) {
			eventElement = this._element.find(this.options.eventElement);
		}
		eventElement[this.options.event](
			$.proxy(function(e){
				if (switcher.options.action === undefined || switcher.options.action.preventDefault != false) {
					e.preventDefault();
				}
				switcher.action(this);
			}, this)
		);
	},

	select: function(){
		this._element.addClass(this.options.selectedClass);
	},
	deselect: function(){
		this._element.removeClass(this.options.selectedClass);
	},

	isSelected: function(){
		return this._element.hasClass(this.options.selectedClass);
	}
}
Switcher.Targets = function(switcher, options){
	if (typeof options == 'string') {
		options = {
			selector: options
		}
	}
	this.options = options;
	this.switcher = switcher;
	
	this.options.actionType = (typeof this.switcher.options.action == 'string' ? this.switcher.options.action : this.switcher.options.action.type);
	
	this._findItems(switcher.items);
}

Switcher.Targets.prototype = {
	_findItems: function(switcherItems){
		this.jItems = $(this.options.selector);
		this.oItems = {};
		
		for (var i = 0, len = switcherItems.length; i < len; i++){
			this.oItems[switcherItems[i]._value] = this._getItemsByValue(switcherItems[i]._value);
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
