Switcher.SwitcherItem = function(options){
	this._element = $(options.element);
	this.switcher = options.switcher;
	
	this.options = options.itemsOptions;
	
	this._selectedClass = options.itemsOptions.selectedClass;
	
	this._setValue();
	this._attachEvents();
	
}

Switcher.SwitcherItem.prototype = {
	_setValue: function(){
		switch (true) {
			case this.options.valueSource == 'index':
				this._value = this.switcher.items.length;
				break;

			case this.options.valueSource == 'id' || this.options.valueAttribute == 'id':
			case this.options.valueSource == 'class' || this.options.valueAttribute == 'class':
			case this.options.valueSource == 'attribute' || this.options.valueAttribute != '':
				this._value = Switcher.utils.getValueFromAttribute(
					this._element,
					this.options.valueAttribute || this.options.valueSource,
					this.options.valuePrefix,
					this.options.valueSuffix
				);
				break;
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
		this.switcher._setSelectedItem(this);
	},
	deselect: function(){
		this._element.removeClass(this._selectedClass);
		this.switcher._clearSelectedItem();
	},

	isSelected: function(){
		return this._element.hasClass(this._selectedClass);
	}
}