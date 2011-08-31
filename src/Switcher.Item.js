Switcher.Item = function(options){
	this._element = $(options.element);
	this.switcher = options.switcher;
	
	this.options = options.itemsOptions;
	
	this._selectedClass = options.itemsOptions.selectedClass;
	
	this._setValue();
	this._attachEvents();
	
}

Switcher.Item.prototype = {
	_setValue: function(){
		this._valueElevemt = this._element;
		
		if (this.options.valueAttribute == "class") {
			this._value = Switcher.utils.getSuffixClass(this._element, this.options.valuePrefix);
		}
	},
	_attachEvents: function(){
		this._element.click(this.click.scope(this));
	},

	click: function(event){
		if (this.isSelected()) return;
		
		this.switcher.deselectSelectedItem();
		this.select();
	},
	select: function(){
		this._element.addClass(this._selectedClass);
		this.switcher.selectedItem = this;
		
		if (this.switcher.selectCallback) {
			this.switcher.selectCallback({ value: this._value });
		}
	},
	deselect: function(){
		this._element.removeClass(this._selectedClass);
		this.switcher.selectedItem = null;
	},

	isSelected: function(){
		return this._element.hasClass(this._selectedClass);
	}
}