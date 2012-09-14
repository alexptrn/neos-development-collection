/**
 */
define(
	[
		'jquery',
		'vie/instance',
		'text!phoenix/templates/content/ui/contentelementHandles.html',
		'phoenix/content/ui/elements/new-contentelement-popover-content'
	],
	function ($, vieInstance, template, ContentElementPopoverContent) {
		if (window._requirejsLoadingTrace) window._requirejsLoadingTrace.push('phoenix/content/ui/contentelement-handles');

		return Ember.View.extend({
			template: Ember.Handlebars.compile(template),

			_element: null,

			_type: 'entity',

			$newAfterPopoverContent: null,

			_entityCollectionIndex: null,

			_width: function() {
				if (this.get('_type') === 'section') {
					return 57;
				}
				return 140;
			}.property(),

			_collection: null,

			popoverPosition: 'right',

			_nodePath: null,

			_pasteInProgress: false,

			_thisElementStartedCut: function() {
				var clipboard = T3.Content.Controller.NodeActions.get('_clipboard');
				if (!clipboard) return false;

				return (clipboard.type === 'cut' && clipboard.nodePath === this.get('_nodePath'));
			}.property('T3.Content.Controller.NodeActions._clipboard', '_nodePath').cacheable(),

			_thisElementStartedCopy: function() {
				var clipboard = T3.Content.Controller.NodeActions.get('_clipboard');
				if (!clipboard) return false;

				return (clipboard.type === 'copy' && clipboard.nodePath === this.get('_nodePath'));
			}.property('T3.Content.Controller.NodeActions._clipboard', '_nodePath').cacheable(),

			didInsertElement: function() {
				var that = this;
				var subject = vieInstance.service('rdfa').getElementSubject(this.get('_element'));
				this.set('_nodePath', vieInstance.entities.get(subject).getSubjectUri());

					// TODO find a way to calculate the width of the button toolbar
				if (this.get('_type') === 'section') {
					this.get('_element').prev().css({
						left: this.get('_element').width() - this.get('_width')
					});
				} else {
					this.$().css({
						left: this.get('_element').offset().left + this.get('_element').width() - this.get('_width')
					});
				}

				this.$newAfterPopoverContent = $('<div />', {id: this.get(Ember.GUID_KEY)});

				this.$().find('.action-new').popover({
					content: this.$newAfterPopoverContent,
					preventLeft: (this.get('popoverPosition')==='left' ? false : true),
					preventRight: (this.get('popoverPosition')==='right' ? false : true),
					preventTop: (this.get('popoverPosition')==='top' ? false : true),
					preventBottom: (this.get('popoverPosition')==='bottom' ? false : true),
					zindex: 10090,
					closeEvent: function() {
						that.set('pressed', false);
					},
					openEvent: function() {
						that.onPopoverOpen.call(that);
					}
				});
			},

			remove: function() {

			},

			cut: function() {
				T3.Content.Controller.NodeActions.cut(this.get('_nodePath'));
			},

			copy: function() {
				T3.Content.Controller.NodeActions.copy(this.get('_nodePath'));
			},

			pasteAfter: function() {
				T3.Content.Controller.NodeActions.pasteAfter(this.get('_nodePath'));
				this.set('_pasteInProgress', true);
			},

			newAfter: function() {
				var that = this;
				this.$().find('.action-new').trigger('showPopover');
			},

			onPopoverOpen: function() {
				var groups = {};

				_.each(this.get('_collection').options.definition.range, function(contentType) {
					var type = this.get('_collection').options.vie.types.get(contentType);
					type.metadata.contentType = type.id.substring(1, type.id.length - 1).replace(T3.ContentModule.TYPO3_NAMESPACE, '');

					if (type.metadata.group) {
						if (!groups[type.metadata.group]) {
							groups[type.metadata.group] = {
								name: type.metadata.group,
								children: []
							};
						}
						groups[type.metadata.group].children.push(type.metadata);
					}
				}, this);

					// Make the data object an array for usage in #each helper
				var data = []
				for (var group in groups) {
					data.push(groups[group]);
				}

				ContentElementPopoverContent.create({
					_options: this.get('_collection').options,
					_index: this.get('_entityCollectionIndex'),
					data: data
				}).replaceIn(this.$newAfterPopoverContent);
			},

			willDestroyElement: function() {
				this.$().find('.action-new').trigger('hidePopover');
			},

			_showRemove: function() {
				// TODO add check if remove action should be shown, now we only show it for entity
				return this.get('_type') === 'entity';
			}.property(),

			_showCut: function() {
				// TODO add check if cut action should be shown, now we only show it for entity
				return this.get('_type') === 'entity';
			}.property(),

			_showCopy: function() {
					// TODO add check if copy action should be shown, now we only show it for entity
				return this.get('_type') === 'entity';
			}.property()

		});
	}
);