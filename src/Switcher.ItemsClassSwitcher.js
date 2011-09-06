Switcher.ItemsClassSwitcher = function(options){
	Switcher.ItemsClassSwitcher.superClass.constructor.call(this, options);
	
	this.options.targets.classPrefix = this.options.targets.classPrefix || '';
}
Switcher.utils.extend(Switcher.ItemsClassSwitcher, Switcher.Simple);

Switcher.ItemsClassSwitcher.prototype._updateTargets = function(){
	if (this.options.targets.addClass) {
		if (this.prevSelectedValue) {
			this.targets.oItems[this.prevSelectedValue]
				.removeClass(this.options.targets.addClass);
		}
		this.targets.oItems[this.selectedValue]
			.addClass(this.options.targets.addClass);
	}
}