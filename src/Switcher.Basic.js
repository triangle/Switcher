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
			
			if (!oThis.selectedItem && newItem.isSelected()){
				oThis.selectedItem = newItem;
			} 
		});
	},
	_itemCallback: function(e, item){
		if (typeof this.options.action === 'undefined' || this.options.action.preventDefault != false) {
			e.preventDefault();
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
	_invokeCallbacks: function(){
		if (this._action) {
			this._action.execute(this);
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
		if (!(this.options.multiselect || item.isSelected() && this.options.multistate)) {
			if (this.isLocked || (item.isSelected() && !this.options.multistate)) return;
			
			if (!(this.options.multistate && item.isSelected())){
				this.deselectSelectedItem();
				
				item.select();
				this._setSelectedItem(item);
				
				this._invokeCallbacks();
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
		multiselect: false
	}
}
