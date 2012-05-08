Switcher.SwitcherItem = function(options){
	this._element = $(options.element);
	
	this.options = options.itemsOptions;
	
	this._setValue(options.itemIndex);
	this._attachEvents(options.switcher);
	
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
	_attachEvents: function(switcher){
		var eventElement = this._element;
		if (this.options.eventElement) {
			eventElement = this._element.find(this.options.eventElement);
		}
		eventElement[this.options.event](
			$.proxy(function(e){
				console.log(this);
				if (switcher.options.action === undefined || switcher.options.action.preventDefault != false) {
					e.preventDefault();
				}
				switcher.action(this);
			}, this)
		);
	},

	select: function(){
		this._element.addClass(this.options.selectedClass);
	},
	deselect: function(){
		this._element.removeClass(this.options.selectedClass);
	},

	isSelected: function(){
		return this._element.hasClass(this.options.selectedClass);
	}
}