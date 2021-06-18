define(function(require) {
    'use strict';

    const moment = require('moment');
    const datetimeFormatter = require('orolocale/js/formatter/datetime');
    const BaseView = require('oroui/js/app/views/base/view');

    const CallDatetimeFieldView = BaseView.extend({
        /**
         * @inheritdoc
         */
        constructor: function CallDatetimeFieldView(options) {
            CallDatetimeFieldView.__super__.constructor.call(this, options);
        },

        /**
         * Read value from the field and returns its JSON format
         *
         * @return {string}
         */
        getValue: function() {
            const value = this.$el.val();
            return moment(value).toJSON();
        },

        /**
         * Converts passed datetime value into backend format and updates the field
         *
         * @param {string} value
         */
        setValue: function(value) {
            value = moment(value).utc().format(datetimeFormatter.backendFormats.datetime);
            this.$el.val(value).trigger('change');
        }
    });

    return CallDatetimeFieldView;
});
