Switcher.ContainerClassSwitcher = function(options){
	Switcher.ContainerClassSwitcher.superClass.constructor.call(this, options);
	
	this.options.targets.classPrefix = this.options.targets.classPrefix || '';
}
Switcher.utils.extend(Switcher.ContainerClassSwitcher, Switcher.Simple);

Switcher.ContainerClassSwitcher.prototype._updateTargets = function(){
	this.targets.container
		.removeClass(this.options.targets.classPrefix + this.prevSelectedValue)
		.addClass(this.options.targets.classPrefix + this.selectedValue);
}