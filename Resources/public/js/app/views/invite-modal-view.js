define(function(require) {
    'use strict';

    const _ = require('underscore');
    const __ = require('orotranslation/js/translator');
    const Modal = require('oroui/js/modal');
    const StartButtonView = require('./start-button-view');
    const modalContentTemplate = require('tpl-loader!../../../templates/invite-modal-content.html');

    const InviteModalView = Modal.extend({
        className: 'modal oro-modal-normal invite-hangout-modal',

        /** @type {StartButtonView} */
        startButtonView: null,

        /** @type {string|null} */
        token: null,

        /** @type {Object} */
        hangoutOptions: null,

        /**
         * @inheritdoc
         */
        constructor: function InviteModalView(options) {
            InviteModalView.__super__.constructor.call(this, options);
        },

        /**
         * @inheritdoc
         */
        initialize: function(options) {
            _.extend(this, _.defaults(_.pick(options, ['hangoutOptions', 'token']), {
                hangoutOptions: {}
            }));
            InviteModalView.__super__.initialize.call(this, options);
        },

        getContentTemplateData: function() {
            return {
                invites: this.hangoutOptions.invites || []
            };
        },

        render: function() {
            this.options.title = __('oro.hangoutscall.start_hangouts_dialog.title');
            this.options.content = modalContentTemplate(this.getContentTemplateData());

            InviteModalView.__super__.render.call(this);

            this.startButtonView = new StartButtonView({
                autoRender: true,
                hangoutOptions: this.hangoutOptions,
                token: this.token
            });
            this.listenTo(this.startButtonView, 'click', function() {
                this.trigger('application-start');
            });

            if (this.startButtonView.deferredRender) {
                this.startButtonView.deferredRender.fail(() => {
                    this.trigger('fail');
                });
            }

            this.$('.modal-footer').append(this.startButtonView.$el);

            return this;
        },

        remove: function() {
            if (this.startButtonView) {
                this.startButtonView.dispose();
                delete this.startButtonView;
            }
            InviteModalView.__super__.remove.call(this);
        }
    });

    return InviteModalView;
});
