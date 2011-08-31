Switcher.Simple = function(options){
	this.options = options || {};

	this.container = $(this.options.container);
	
	this._findItems();
	this._attachCallback();
	
	this.selectedItem.select();
}

Switcher.Simple.prototype = {
	_findItems: function(){
		var oThis = this;
		this.items = [];
		
		this.container.find(this.options.items.selector).each(function(){
			var newItem = new Switcher.Item({
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

	deselectSelectedItem: function(){
		if (this.selectedItem) {
			this.selectedItem.deselect();
		}
	},
	deselectAllItems: function(){
		for (var i = 0, num = this.items.length; i < num; i++){
			this.items[i].deselect();
		}
	}
}