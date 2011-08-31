Switcher.Simple = function(options){
	this.options = options || {};

	this.container = $(this.options.container);
	
	this._findItems();
}

Switcher.Simple.prototype = {
	_findItems: function(){
		var oThis = this;
		this.items = [];
		
		this.container.find(this.options.itemSelector).each(function(){
			var newItem = new Switcher.Item($(this), oThis);
			oThis.items.push(newItem);
			
			if (!oThis.selectedItem && newItem.isSelected()){
				oThis.selectedItem = newItem;
			} 
		});
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