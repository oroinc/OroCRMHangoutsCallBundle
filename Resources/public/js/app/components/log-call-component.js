define(function(require) {
    'use strict';

    var LogCallStartHangoutComponent;
    var _ = require('underscore');
    var PhoneFieldView = require('../views/log-call/phone-field-view');
    var DurationFieldView = require('../views/log-call/duration-field-view');
    var CallDatetimeFieldView = require('../views/log-call/call-datetime-field-view');
    var StartButtonView = require('../views/start-button-view');
    var HangoutsEventBroker = require('orocrmhangoutscall/js/hangouts-event-broker');
    var BaseComponent = require('oroui/js/app/components/base/component');

    LogCallStartHangoutComponent = BaseComponent.extend({
        /** @type {HangoutsEventBroker} */
        eventBroker: null,

        /**
         * @inheritDoc
         */
        initialize: function(options) {
            LogCallStartHangoutComponent.__super__.initialize.call(this, options);
            this.hangoutOptions = _.clone(options.hangoutOptions || {});
            this.setEventBroker(new HangoutsEventBroker());
            this.initViews(options);
        },

        /**
         * Sets eventBroker
         * - first disposes old eventBroker if exists
         * - then bind event handlers
         *
         * @param {HangoutsEventBroker} eventBroker
         */
        setEventBroker: function(eventBroker) {
            if (this.eventBroker) {
                this.stopListening(this.eventBroker);
                this.eventBroker.dispose();
            }

            this.eventBroker = eventBroker;
            this.listenTo(this.eventBroker, {
                'call-started': this.onCallStart,
                'call-is-going': this.onCallIsGoing,
                'call-ended': this.onCallEnd
            });
        },

        /**
         * Sets external eventBroker
         * (in case a hangout is already started and a log-call dialog was opened as consequence of some action)
         *
         * @param {HangoutsEventBroker} eventBroker
         */
        setExternalEventBroker: function(eventBroker) {
            this.setEventBroker(eventBroker);

            // replay all missed events for the instance
            this.eventBroker.repeatTriggerFor(this);
            // hide own start a hangout button
            this.startButtonView.disable();
        },

        /**
         * Initializes views
         */
        initViews: function(options) {
            // create start button view
            this.startButtonView = new StartButtonView({
                autoRender: true,
                el: options._sourceElement,
                hangoutOptions: options.hangoutOptions || {},
                token: this.eventBroker.getToken()
            });

            var $root = options._sourceElement.closest('form, .ui-dialog');

            // wraps phone field with related view
            var $phoneField = $root.find('[name="orocrm_call_form[phoneNumber]"]');
            if ($phoneField.length) {
                this.phoneFieldView = new PhoneFieldView({
                    el: $phoneField[0]
                });
                this.listenTo(this.phoneFieldView, 'change', this.updateStartButton);
            }

            // wraps duration field with related view
            var $durationField = $root.find('[name="orocrm_call_form[duration]"]');
            if ($durationField.length) {
                this.durationFieldView = new DurationFieldView({
                    el: $durationField[0]
                });
            }

            // wraps callDateTime field with related view
            var $callDatetimeField = $root.find('[name="orocrm_call_form[callDateTime]"]');
            if ($callDatetimeField.length) {
                this.callDatetimeFieldView = new CallDatetimeFieldView({
                    el: $callDatetimeField[0]
                });
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
                    invite_type: phone.match(/^.+@.+\..+$/) ? 'EMAIL' : 'PHONE'
                }];
            } else {
                delete this.hangoutOptions.invites;
            }
            this.startButtonView.setHangoutOptions(this.hangoutOptions);
            this.startButtonView.render();
        },

        /**
         * Handles 'call-started' event
         *  - update phone number field (if number is passed)
         *  - update call datetime field
         *
         * @param {Object} data
         */
        onCallStart: function(data) {
            if (this.phoneFieldView && data.number) {
                var notNumber = /[^\d]/g;
                // clear format for both numbers (current and new)
                var oldNumber =  this.phoneFieldView.getValue().replace(notNumber, '');
                var newNumber = data.number.replace(notNumber, '');
                // compare ending parts of numbers (without country part, it might not exist in new number)
                if (oldNumber.slice(-newNumber.length) !== newNumber) {
                    this.phoneFieldView.setValue(data.number);
                }
            }

            if (this.callDatetimeFieldView) {
                this.callDatetimeFieldView.setValue(data.startedAt);
            }
        },

        /**
         * Handles 'call-is-going' event
         *  - update duration field
         *
         * @param {Object} data
         */
        onCallIsGoing: function(data) {
            if (this.durationFieldView) {
                this.durationFieldView.setValue(Math.floor(data.duration / 1000));
            }
        },

        /**
         * Handles 'call-ended' event
         *  - update duration field
         *
         * @param {Object} data
         */
        onCallEnd: function(data) {
            if (this.durationFieldView) {
                this.durationFieldView.setValue(Math.round(data.duration / 1000));
            }
        }
    });

    return LogCallStartHangoutComponent;
});
