Switcher.ContainerClassSwitcher = function(options){
	Switcher.ContainerClassSwitcher.superClass.constructor.call(this, options);
	
	this._slavesContainer = $(this.options.controlledItems.container);
}
Switcher.utils.extend(Switcher.ContainerClassSwitcher, Switcher.Simple);

Switcher.ContainerClassSwitcher.prototype._updateSlaves = function(){
	this._slavesContainer
		.removeClass(this.options.controlledItems.classPrefix + this.prevSelectedValue)
		.addClass(this.options.controlledItems.classPrefix + this.selectedValue);
}