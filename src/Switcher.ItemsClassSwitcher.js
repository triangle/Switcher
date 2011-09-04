Switcher.ItemsClassSwitcher = function(options){
	Switcher.ItemsClassSwitcher.superClass.constructor.call(this, options);
	
	this.options.controlledItems.classPrefix = this.options.controlledItems.classPrefix || '';
	
	this._findSlaves();
}
Switcher.utils.extend(Switcher.ItemsClassSwitcher, Switcher.Simple);

Switcher.ItemsClassSwitcher.prototype._findSlaves = function(){
	this._slaves = {
		container: $(this.options.controlledItems.container)
	}
	
	this._slaves.items = this._slaves.container.find(this.options.controlledItems.selector);
	this._slaves.oItems = {};
	
	for (var i = 0, len = this.items.length; i < len; i++){
		this._slaves.oItems[this.items[i]._value] = this._getSlavesForSwitcherItem(this.items[i]._value);
	}
	
	var oThis = this;

	
}

Switcher.ItemsClassSwitcher.prototype._getSlavesForSwitcherItem = function(value){
	if (this.options.controlledItems.link == 'class'){
		return this._slaves.items.filter('.' + this.options.controlledItems.linkPrefix + value);		
	}	
}

Switcher.ItemsClassSwitcher.prototype._updateSlaves = function(){
	if (this.options.controlledItems.addClass) {
		if (this.prevSelectedValue) {
			this._slaves.oItems[this.prevSelectedValue]
				.removeClass(this.options.controlledItems.addClass);
		}
		this._slaves.oItems[this.selectedValue]
			.addClass(this.options.controlledItems.addClass);
	}
}