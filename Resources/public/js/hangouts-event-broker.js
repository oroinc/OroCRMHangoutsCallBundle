define(function(require) {
    'use strict';

    const tools = require('oroui/js/tools');
    const BaseClass = require('oroui/js/base-class');

    const HangoutsEventBroker = BaseClass.extend({
        /** @type {number|null} */
        interval: null,

        /** @type {string|null} */
        token: null,

        /** @type {Array} */
        history: null,

        /**
         * @inheritdoc
         */
        constructor: function HangoutsEventBroker(options) {
            HangoutsEventBroker.__super__.constructor.call(this, options);
        },

        /**
         * @inheritdoc
         * @param {Object} options
         * @param {string=} options.token a key to distinguish hangout call process
         */
        initialize: function(options) {
            this.token = options.token || tools.createRandomUUID();
            this.history = [];
            setInterval(this._checkStorage.bind(this), 50);
            HangoutsEventBroker.__super__.initialize.call(this, options);
        },

        /**
         * @inheritdoc
         */
        dispose: function() {
            if (this.disposed) {
                return;
            }
            clearInterval(this.interval);
            HangoutsEventBroker.__super__.dispose.call(this);
        },

        /**
         * Returns token for the instance
         *
         * @return {string}
         */
        getToken: function() {
            return this.token;
        },

        /**
         * Allows to execute handlers related to a specific context for missed events
         *
         * @param {Object} context
         */
        repeatTriggerFor: function(context) {
            let message;
            let events;
            if (!this._events) {
                // nothing to replay
                return;
            }
            for (let i = 0; i < this.history.length; i++) {
                message = this.history[i];
                events = this._events[message.name];
                if (!events) {
                    continue;
                }
                for (let j = 0; j < events.length; j++) {
                    if (events[j].context === context) {
                        events[j].callback.call(events[j].ctx, message.data);
                    }
                }
            }
        },

        /**
         * Check the storage and triggers events
         *
         * @protected
         */
        _checkStorage: function() {
            const key = 'from-app:' + this.token;
            let events = localStorage.getItem(key);
            if (events) {
                localStorage.removeItem(key);
                events = JSON.parse(events);
                for (let i = 0; i < events.length; i++) {
                    this.trigger(events[i].name, events[i].data);
                    this.history.push(events[i]);
                }
            }
        },

        /**
         * Pushes message to hangout application
         *
         * @param {string} name
         * @param {*} data
         */
        dispatchToApp: function(name, data) {
            const key = 'to-app:' + this.token;
            localStorage.setItem(key, JSON.stringify({
                name: name,
                data: data
            }));
        }
    });

    return HangoutsEventBroker;
});
