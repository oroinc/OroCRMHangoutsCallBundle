define(function(require) {
    'use strict';

    var InviteModalView;
    var _ = require('underscore');
    var __ = require('orotranslation/js/translator');
    var Modal = require('oroui/js/modal');
    var modalContentTemplate = require('tpl!../../../templates/invite-modal-content.html');

    InviteModalView = Modal.extend({
        className: 'modal oro-modal-normal invite-hangout-modal',

        /**
         * @type {HTMLIFrameElement}
         */
        startButton: null,

        initialize: function(options) {
            _.extend(this, _.defaults(_.pick(options, ['invites']), {
                invites: []
            }));

            options.title = __('orocrm.hangoutscall.start_hangouts_dialog.title');
            options.content = modalContentTemplate(this.getContentTemplateData());
            InviteModalView.__super__.initialize.call(this, options);
        },

        getContentTemplateData: function() {
            return {
                invites: this.invites
            };
        },

        addStartButton: function(startButton) {
            this.startButton = startButton;
            if (this.isRendered) {
                this.appendStartButton();
            }
        },

        render: function() {
            InviteModalView.__super__.render.call(this);
            this.$('.modal-footer').append('<div class="start-button-place-holder" />');
            if (this.startButton) {
                this.appendStartButton();
            }
            return this;
        },

        appendStartButton: function() {
            this.$('.modal-footer .start-button-place-holder').append(this.startButton);
        }
    });

    return InviteModalView;
});
