Switcher.SwitcherItem = function(options){
	this._element = $(options.element);
	
	this.options = options.itemsOptions;
	
	this._selectedClass = options.itemsOptions.selectedClass;
	
	this._setValue(options.switcher);
	this._attachEvents(options.switcher);
	
}

Switcher.SwitcherItem.prototype = {
	_setValue: function(switcher){
		switch (true) {
			case this.options.valueSource == 'id' || this.options.valueAttribute == 'id':
			case this.options.valueSource == 'class' || this.options.valueAttribute == 'class':
			case this.options.valueSource == 'attribute' || (this.options.valueAttribute !== undefined && this.options.valueAttribute != ''):
				this._value = Switcher.utils.getValueFromAttribute(
					this._element,
					this.options.valueAttribute || this.options.valueSource,
					this.options.valuePrefix,
					this.options.valueSuffix
				);
				break;
			
			case this.options.valueSource == 'index':
				this._value = switcher.items.length;
				break;
		}
	},
	_attachEvents: function(switcher){
		this._element.click($.proxy(function(){ switcher.click(this) }, this));
	},

	select: function(){
		this._element.addClass(this._selectedClass);
	},
	deselect: function(){
		this._element.removeClass(this._selectedClass);
	},

	isSelected: function(){
		return this._element.hasClass(this._selectedClass);
	}
}