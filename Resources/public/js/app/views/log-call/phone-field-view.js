define(function(require) {
    'use strict';

    var PhoneFieldView;
    var BaseView = require('oroui/js/app/views/base/view');
    require('jquery.select2');

    PhoneFieldView = BaseView.extend({
        events: {
            change: function() {
                this.trigger('change', this.$el.val());
            }
        },

        /**
         * @inheritDoc
         */
        constructor: function PhoneFieldView() {
            PhoneFieldView.__super__.constructor.apply(this, arguments);
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
