define(function(require) {
    'use strict';

    var InviteHangoutComponent;
    var _ = require('underscore');
    var mediator = require('oroui/js/mediator');
    var __ = require('orotranslation/js/translator');
    var InviteButtonView = require('../views/invite-button-view');
    var InviteModalView = require('../views/invite-modal-view');
    var BaseComponent = require('oroui/js/app/components/base/component');

    InviteHangoutComponent = BaseComponent.extend({
        /**
         * @type {Object}
         */
        modalOptions: null,

        initialize: function(options) {
            _.extend(this, _.defaults(_.pick(options, ['modalOptions']), {
                modalOptions: {}
            }));

            this.inviteButtonView = new InviteButtonView({
                el: options._sourceElement[0]
            });
            this.listenTo(this.inviteButtonView, 'invite', this.openInviteModal);
        },

        openInviteModal: function() {
            this.inviteModal = new InviteModalView(this.modalOptions);

            this.listenTo(this.inviteModal, {
                hidden: this.unsetInviteModal,
                fail: this.onStartButtonFail
            });

            this.inviteModal.open();
        },

        unsetInviteModal: function() {
            this.stopListening(this.inviteModal);
            delete this.inviteModal;
        },

        onStartButtonFail: function() {
            if (this.inviteModal) {
                this.inviteModal.close();
            }
            mediator.execute('showErrorMessage', __('orocrm.hangoutscall.messages.connection_error'));
        }
    });

    return InviteHangoutComponent;
});
