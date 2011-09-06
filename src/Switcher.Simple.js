Switcher.Simple = function(options){
	this.options = $.extend(true, {}, this.defaultOptions, options);

	this.container = $(this.options.container);
	
	this._findItems();
	this._attachCallback();
	
	if (this.options.targets) {
		this.targets = new Switcher.Targets(this, this.options.targets)
	}
}

Switcher.Simple.prototype = {
	_findItems: function(){
		var oThis = this;
		this.items = [];
		
		this.container.find(this.options.items.selector).each(function(){
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
		if (this.options.selectCallback && typeof this.options.selectCallback === 'function') {
			this.selectCallback = this.options.selectCallback;
		}
	},
	_setSelectedItem: function(item){
		if (this.selectedItem) {
			this.prevSelectedItem  = this.selectedItem;
			this.prevSelectedValue = this.selectedItem._value;
		}
		this.selectedItem  = item;
		this.selectedValue = item._value;
		
		this._invokeCallbacks();
	},
	_clearSelectedItem: function(item){
		if (this.selectedItem) {
			this.prevSelectedItem  = this.selectedItem;
			this.prevSelectedValue = this.selectedItem._value;
		}
		this.selectedItem  = null;
		this.selectedValue = null
	},
	_invokeCallbacks: function(){
		if (this._updateTargets) {
			this._updateTargets();
		}
		
		if (this.targets) {
			this.targets.updateItems(this.selectedValue, this.prevSelectedValue);
		}
		
		if (this.selectCallback) {
			this.selectCallback({ value: this.selectedValue });
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
			selectedClass: 'switcher-item_selected',
			valueSource: 'class'
		}
	}
}