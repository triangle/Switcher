Switcher.Item = function(element, switcher){
	this._element = element;
	this._switcher = switcher;
	this._selectedClass = this._switcher.options.selectedClass;
	
	this._setValue();
	this._attachEvents();
}

Switcher.Item.prototype = {
	_setValue: function(){
		this._valueElevemt = this._element;
		
		if (this._switcher.options.itemValueAttribute == "class") {
			this._value = Switcher.utils.getSuffixClass(this._element, this._switcher.options.itemValuePrefix);
		}
	},
	_attachEvents: function(){
		this._element.click(this.click.scope(this));
	},

	click: function(event){
		if (this.isSelected()) return;
		
		this._switcher.deselectSelectedItem();
		this.select();
	},
	select: function(){
		this._element.addClass(this._selectedClass);
		this._switcher.selectedItem = this;
	},
	deselect: function(){
		this._element.removeClass(this._selectedClass);
		this._switcher.selectedItem = null;
	},

	isSelected: function(){
		return this._element.hasClass(this._selectedClass);
	}
}