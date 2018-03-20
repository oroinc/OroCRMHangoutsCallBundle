define(function(require) {
    'use strict';

    var InviteButtonView;
    var BaseView = require('oroui/js/app/views/base/view');

    InviteButtonView = BaseView.extend({
        events: {
            click: function() {
                this.trigger('invite');
            }
        },

        /**
         * @inheritDoc
         */
        constructor: function InviteButtonView() {
            InviteButtonView.__super__.constructor.apply(this, arguments);
        }
    });

    return InviteButtonView;
});
