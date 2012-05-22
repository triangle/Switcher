Switcher.SwitcherItem = function(options){
	this._element = $(options.element);
	
	this.options = options.itemsOptions;
	
	this._eventElement = this._element;
	if (this.options.eventElement) {
		this._eventElement = this._element.find(this.options.eventElement);
	}
	
	this._setValue(options.itemIndex);
}

Switcher.SwitcherItem.prototype = {
	_setValue: function(itemIndex){
		this._index = itemIndex;
		
		switch (true) {
			case this.options.valueSource == 'id' || this.options.valueAttribute == 'id':
			case this.options.valueSource == 'class' || this.options.valueAttribute == 'class':
			case this.options.valueSource == 'attribute' || (this.options.valueAttribute !== undefined && this.options.valueAttribute != ''):
				this._value = Switcher.utils.getValueFromAttribute(
					this._element,
					this.options.valueAttribute || this.options.valueSource,
					this.options.valueTemplate || '%'
				);
				break;
			
			case this.options.valueSource == 'index':
				this._value = itemIndex;
				break;
		}
	},

	select: function(){
		this._element.addClass(this.options.selectedClass);
		if(this.options.deselectedClass){
			this._element.removeClass(this.options.deselectedClass);
		}
	},
	deselect: function(){
		this._element.removeClass(this.options.selectedClass);
		if(this.options.deselectedClass){
			this._element.addClass(this.options.deselectedClass);
		}
	},

	isSelected: function(){
		return this._element.hasClass(this.options.selectedClass);
	}
}