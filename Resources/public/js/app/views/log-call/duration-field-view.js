define(function(require) {
    'use strict';

    const numberFormatter = require('orolocale/js/formatter/number');
    const BaseView = require('oroui/js/app/views/base/view');

    const DurationFieldView = BaseView.extend({
        /**
         * @inheritdoc
         */
        constructor: function DurationFieldView(options) {
            DurationFieldView.__super__.constructor.call(this, options);
        },

        getValue: function() {
            const value = this.$el.val();
            return numberFormatter.unformatDuration(value);
        },

        setValue: function(value) {
            const duration = numberFormatter.formatDuration(value);
            this.$el.val(duration).trigger('change');
        }
    });

    return DurationFieldView;
});
