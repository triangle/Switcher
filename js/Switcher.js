/*
 * Switcher v0.53
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
	
	this._initItems();
	this._attachCallback();
	
	if (this.options.targets) {
		this.targets = new Switcher.Targets(this, this.options.targets)
		
		if (options.action) {
			this._action = new Switcher.Action(this, options.action);
		}
	}
	
	this._processInitValue();
}

Switcher.Basic.prototype = {
	_initItems: function(){
		var oThis = this;
		this.items = [];
		
		this.jItems = $(this.options.items.selector); 
		
		this.jItems.each(function(){
			var newItem = new Switcher.SwitcherItem({
				element: this,
				itemsOptions: oThis.options.items,
				itemIndex: oThis.items.length
			});
			oThis.items.push(newItem);
			
			newItem._eventElement[oThis.options.items.event](
				$.proxy(function(e){
					this._itemCallback(e, newItem);
				}, oThis)
			);
			
			if (!oThis.selectedItem && newItem.isSelected() && typeof oThis.options.initValue === 'undefined'){
				oThis.options.initValue = newItem._value;
				oThis._setSelectedItem(newItem);
			} 
		});
	},
	_itemCallback: function(e, item){
		if (typeof this.options.action === 'undefined' || this.options.action.preventDefault != false) {
			e.preventDefault();
		}
		if (this.options.stopPropagation != false) {
			e.stopPropagation();
		}
		this.action(item);
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
	_callback: function(){
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
	
	_processInitValue: function(){
		if(typeof this.options.initValue !== 'undefined') {
			for(var i = 0, len = this.items.length; i < len; i++){
				if (this.options.initValue == this.options.initValueTemplate.replace('%', this.items[i]._value)){
					this.items[i]._eventElement.eq(0)[this.options.items.event]();
					this._initedValue = this.items[i]._value;
					
					if (!this.options.multiselect) break;
				} else {
					this.items[i].deselect();
				}
			}
			
			if (typeof this._initedValue !== 'undefined' && this.targets) {
				for (value in this.targets.oItems) {
					if (this.targets.oItems.hasOwnProperty(value) && value != this._initedValue) {
						this._action._reverse(value, true);
					}
				}
			}
		}
	},
	
	action: function(item){
		if (!(this.options.multiselect || item.isSelected() && this.options.multistate)) {
			if (this.isLocked || (item.isSelected() && !this.options.multistate)) return;
			
			if (!(this.options.multistate && item.isSelected())){
				this.deselectSelectedItem();
				
				item.select();
				this._setSelectedItem(item);
				
				if (this._action) {
					this._action.execute(this);
				}
			}
		} else if (this.options.multiselect || this.options.multistate) {
			if (this.isLocked) return;
			
			if (item.isSelected()) {
				item.deselect();
				if (this._action) {
					this._action._reverse(item._value);
				}
			} else {
				if (!this.options.multistate) {
					item.select();
					if (this.targets) {
						this._action._forward(item._value);
					}
				}
			}
		}
		
		this._callback();
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
			selectedClass: 'selected',
			valueSource: 'index',
			event: 'click'
		},
		multiselect: false,
		initValueTemplate: '%',
		stopPropagation: false
	}
}

Switcher.SwitcherItem = function(options){
	this._element = $(options.element);
	
	this.options = options.itemsOptions;
	
	this._eventElement = this._element;
	if (this.options.eventElement) {
		this._eventElement = this._element.find(this.options.eventElement);
	}
	
	this._setValue(options.itemIndex);
}

Switcher.SwitcherItem.prototype = {
	_setValue: function(itemIndex){
		this._index = itemIndex;
		
		switch (true) {
			case this.options.valueSource == 'id' || this.options.valueAttribute == 'id':
			case this.options.valueSource == 'class' || this.options.valueAttribute == 'class':
			case this.options.valueSource == 'attribute' || (this.options.valueAttribute !== undefined && this.options.valueAttribute != ''):
				this._value = Switcher.utils.getValueFromAttribute(
					this._element,
					this.options.valueAttribute || this.options.valueSource,
					this.options.valueTemplate || '%'
				);
				break;
			
			case this.options.valueSource == 'index':
				this._value = itemIndex;
				break;
		}
	},

	select: function(){
		this._element.addClass(this.options.selectedClass);
		if(this.options.deselectedClass){
			this._element.removeClass(this.options.deselectedClass);
		}
	},
	deselect: function(){
		this._element.removeClass(this.options.selectedClass);
		if(this.options.deselectedClass){
			this._element.addClass(this.options.deselectedClass);
		}
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
	this.options.linkTemplate = this.options.linkTemplate || '%'; 
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
		var selector = this.options.linkTemplate.replace(/%/g, value);

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
	}
}
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
		case 'slide':
			action = new Switcher.Action.Slide(options);
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


Switcher.Action.Slide = function(options) {
	this.easing = options.fadeEasing;
	this.duration = options.fadeDuration;
}

Switcher.Action.Slide.prototype = {
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
				targets.slideUp(this.duration, this.easing, callback || $.proxy(this.switcher, "_unlock"));
			} else {
				targets.hide();
			}
		}
	},
	forward: function(targets, value) {
		if (targets) {
			this.switcher._lock();
			targets.slideDown(this.duration, this.easing, $.proxy(this.switcher, "_unlock"));
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
