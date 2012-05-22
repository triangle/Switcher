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
					this.items[i]._eventElement[this.options.items.event]();
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
		initValueTemplate: '%'
	}
}
