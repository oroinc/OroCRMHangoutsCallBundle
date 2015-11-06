define(function(require) {
    'use strict';

    var PhoneFieldView;
    var BaseView = require('oroui/js/app/views/base/view');

    PhoneFieldView = BaseView.extend({
        events: {
            change: function() {
                this.trigger('change', this.$el.val());
            }
        }
    });

    return PhoneFieldView;
});
