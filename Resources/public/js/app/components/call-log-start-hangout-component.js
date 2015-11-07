define(function(require) {
    'use strict';

    var LogCallStartHangoutComponent;
    var _ = require('underscore');
    var PhoneFieldView = require('../views/phone-field-view');
    var ViewComponent = require('oroui/js/app/components/view-component');

    LogCallStartHangoutComponent = ViewComponent.extend({
        /**
         * @inheritDoc
         */
        initialize: function(options) {
            LogCallStartHangoutComponent.__super__.initialize.call(this, options);
            this.hangoutOptions = _.clone(options.hangoutOptions || {});

            // check if there's phone field, then bind update start button handler on phone change
            var $phoneField = options._sourceElement.closest('form, .ui-dialog')
                .find('[name="orocrm_call_form[phoneNumber]"]');
            if ($phoneField.length) {
                this.phoneFieldView = new PhoneFieldView({
                    el: $phoneField[0]
                });
                this.listenTo(this.phoneFieldView, 'change', this.updateStartButton);
            }
        },

        /**
         * Handles phone change event and updates "Start a Hangout" button
         *
         * @param {string} phone
         */
        updateStartButton: function(phone) {
            if (phone) {
                this.hangoutOptions.invites = [{
                    id: phone,
                    invite_type: 'PHONE'
                }];
            } else {
                delete this.hangoutOptions.invites;
            }
            this.view.setHangoutOptions(this.hangoutOptions);
            this.view.render();
        }
    });

    return LogCallStartHangoutComponent;
});
