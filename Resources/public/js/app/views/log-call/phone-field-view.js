define(function(require) {
    'use strict';

    const BaseView = require('oroui/js/app/views/base/view');
    require('jquery.select2');

    const PhoneFieldView = BaseView.extend({
        events: {
            change: function() {
                this.trigger('change', this.$el.val());
            }
        },

        /**
         * @inheritdoc
         */
        constructor: function PhoneFieldView(options) {
            PhoneFieldView.__super__.constructor.call(this, options);
        },

        getValue: function() {
            return this.$el.select2('val');
        },

        setValue: function(value) {
            this.$el.select2('val', value);
        }
    });

    return PhoneFieldView;
});
