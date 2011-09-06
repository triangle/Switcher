Switcher.Targets = function(switcher, options){
	this.options = options;
	this.switcher = switcher
	
	this.container = $(this.options.container);
	
	this._findItems();
}

Switcher.Targets.prototype = {
	_findItems: function(){
		this.items = this.container.find(this.options.selector);
		this.oItems = {};
		
		for (var i = 0, len = this.switcher.items.length; i < len; i++){
			this.oItems[this.switcher.items[i]._value] = this._getItemsByValue(this.switcher.items[i]._value);
		}
	},
	_getItemsByValue: function(value){
		var selector = (this.options.linkPrefix || '') + value + (this.options.linkSuffix || '');

		switch (true) {
			case this.options.linkSource == 'index':
				return this.items.eq(value);
				break;

			case this.options.linkSource == 'id' || this.options.linkAttribute == 'id':
				return this.items.filter('#' + selector);
				break;

			case this.options.linkSource == 'class' || this.options.linkAttribute == 'class':
				return this.items.filter('.' + selector);
				break;

			case this.options.linkSource == 'attribute' || this.options.linkAttribute:
				return this.items.filter('[name~="' + selector + '"]');
				break;
		}
	}
}