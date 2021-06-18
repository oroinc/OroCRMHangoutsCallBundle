define(function(require) {
    'use strict';

    const _ = require('underscore');
    const BaseView = require('oroui/js/app/views/base/view');
    require('jquery.select2');

    const NotesFieldView = BaseView.extend({
        /**
         * @inheritdoc
         */
        constructor: function NotesFieldView(options) {
            NotesFieldView.__super__.constructor.call(this, options);
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
            this.$el.val(_.nl2br(value)).trigger('change');
        }
    });

    return NotesFieldView;
});
