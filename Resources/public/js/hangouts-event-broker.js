define(function(require) {
    'use strict';

    var HangoutsEventBroker;
    var _ = require('underscore');
    var BaseClass = require('oroui/js/base-class');

    HangoutsEventBroker = BaseClass.extend({
        /** @type {number|null} */
        interval: null,

        /** @type {string|null} */
        token: null,

        /**
         * @inheritDoc
         * @param {Object} options
         * @param {string} options.token a key to distinguish hangout call process
         */
        initialize: function(options) {
            if (!options.token) {
                throw new TypeError('Missing required option "token"');
            }
            _.extend(this, _.pick(options, ['token']));
            setInterval(_.bind(this._checkStorage, this), 50);
            HangoutsEventBroker.__super__.initialize.call(this, options);
        },

        /**
         * @inheritDoc
         */
        dispose: function() {
            if (this.disposed) {
                return;
            }
            clearInterval(this.interval);
            HangoutsEventBroker.__super__.dispose.call(this);
        },

        /**
         * Check the storage and triggers events
         *
         * @protected
         */
        _checkStorage: function() {
            var messages = localStorage.getItem(this.token);
            if (messages) {
                localStorage.removeItem(this.token);
                messages = JSON.parse(messages);
                for (var i = 0; i < messages.length; i++) {
                    this.trigger(messages[i].name, messages[i].data);
                }
            }
        }
    });

    return HangoutsEventBroker;
});
