define(function(require) {
    'use strict';

    var HangoutsComponent;
    var _ = require('underscore');
    var mediator = require('oroui/js/mediator');
    var __ = require('orotranslation/js/translator');
    var InviteButtonView = require('../views/invite-button-view');
    var InviteModalView = require('../views/invite-modal-view');
    var BaseComponent = require('oroui/js/app/components/base/component');
    var startButtonLoader = require('../../start-button-loader');

    HangoutsComponent = BaseComponent.extend({
        /**
         * @type {Object}
         */
        hangoutOptions: null,

        /**
         * @param {Object} options
         * @param {Object} options.hangoutOptions - options for "Start a Hangout" button
         * @param {string} options.hangoutOptions.topic - Pre-populates the topic field for Hangouts on Air.
         *     Note that users can change the topic of the Hangout after they have joined.
         * @param {Array<{id: string, invite_type: 'PROFILE'|'CIRCLE'|'EMAIL'|'PHONE'}>} options.hangoutOptions.invites
         *     - This array of JavaScript objects specifies the list of people to invite
         *     when the user clicks the Hangout button. Invalid objects and parameters are ignored.
         * @param {Array<{app_id: string, start_data: string, app_type: string }>} options.hangoutOptions.initial_apps
         *     - This optional parameter specifies the type of Hangout app created when the user clicks the button.
         *     Setting this parameter changes the way that Hangout applications are loaded for the Hangout
         *     and its participants. The following values are supported:
         *         LOCAL_APP - Launches the app for only the user who clicks the widget.
         *         ROOM_APP - (Default) Launches the app for every participant who joins the Google+ Hangout.
         * @param {'normal'|'onair'|'party'|'moderated'} options.hangoutOptions.hangout_type - Specifies what type
         *     of Hangout should be started.
         *     normal - (Default) Launch the Hangout app without broadcasting to YouTube or starting a Hangout party.
         *     onair - Launch the Hangout to be broadcast on YouTube as a Hangout On Air.
         *     party - Launch the Hangout app as a Hangout party.
         *     moderated -Launch the Hangout app with Control Room enabled.
         * @param {number} options.hangoutOptions.widget_size - Specifies the width of the button.
         *     The default value is 136.
         */
        initialize: function(options) {
            _.extend(this, _.defaults(_.pick(options, ['hangoutOptions']), {
                hangoutOptions: {}
            }));

            this.inviteButtonView = new InviteButtonView({
                el: options._sourceElement[0]
            });
            this.listenTo(this.inviteButtonView, 'invite', this.openInviteModal);
        },

        getStartButtonOptions: function() {
            return this.hangoutOptions;
        },

        openInviteModal: function() {
            if (this.modal) {
                this.modal.remove();
            }

            var modal = this.modal = new InviteModalView({
                invites: this.hangoutOptions.invites || []
            });
            this.modal.open();

            startButtonLoader(this.getStartButtonOptions())
                .done(function(button) {
                    modal.addStartButton(button);
                })
                .fail(_.bind(this.onStartButtonFail, this));
        },

        onStartButtonFail: function() {
            if (this.modal) {
                this.modal.close();
            }
            mediator.execute('showErrorMessage', __('orocrm.hangoutscall.messages.connection_error'));
        }
    });

    return HangoutsComponent;
});
