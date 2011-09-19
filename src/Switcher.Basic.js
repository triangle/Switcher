Switcher.Basic = function(options){
	if (typeof options.items == 'string') {
		options.items = {
			selector: options.items
		}
	}
	this.options = $.extend(true, {}, this.defaultOptions, options);
	this.options.items.container = this.options.items.container || ''; 
	
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
		
		$(this.options.items.container + ' ' + this.options.items.selector).each(function(){
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
			this.targets.updateItems(this.selectedValue, this.prevSelectedValue);
		}
		
		if (this.selectCallback) {
			this.selectCallback({ value: this.selectedValue });
		}		
	},
	
	click: function(item){
		if (item.isSelected()) return;
		
		this.deselectSelectedItem();
		
		item.select();
		this._setSelectedItem(item);
		
		this._invokeCallbacks();
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
			valueSource: 'index'
		}
	}
}