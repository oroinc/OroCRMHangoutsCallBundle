define(function(require) {
    'use strict';

    const BaseView = require('oroui/js/app/views/base/view');

    const InviteButtonView = BaseView.extend({
        events: {
            click: function() {
                this.trigger('invite');
            }
        },

        /**
         * @inheritdoc
         */
        constructor: function InviteButtonView(options) {
            InviteButtonView.__super__.constructor.call(this, options);
        }
    });

    return InviteButtonView;
});
