define(function(require) {
    'use strict';

    const BaseView = require('oroui/js/app/views/base/view');
    require('jquery.select2');

    const SubjectFieldView = BaseView.extend({
        /**
         * @inheritdoc
         */
        constructor: function SubjectFieldView(options) {
            SubjectFieldView.__super__.constructor.call(this, options);
        },

        /**
         * Read value from the field
         *
         * @return {string}
         */
        getValue: function() {
            return this.$el.val();
        },

        /**
         * Updates field's value
         *
         * @param {string} value
         */
        setValue: function(value) {
            this.$el.val(value).trigger('change');
        }
    });

    return SubjectFieldView;
});
