define(function(require) {
    'use strict';

    var CalendarEventStartHangoutComponent;
    var _ = require('underscore');
    var StartButtonView = require('../views/start-button-view');
    var AutocompleteResultsCollection = require('oroform/js/app/models/autocomplete-results-collection');
    var BaseComponent = require('oroui/js/app/components/base/component');

    CalendarEventStartHangoutComponent = BaseComponent.extend({
        /**
         * @type {Object}
         */
        calendarEvent: null,

        listen: {
            'sync collection': 'onInvitesSync'
        },

        initialize: function(options) {
            _.extend(this, _.defaults(_.pick(options, ['calendarEvent']), {
                calendarEvent: {}
            }));

            this.startButtonView = new StartButtonView({
                el: options._sourceElement
            });

            // collection of invited users
            this.collection = new AutocompleteResultsCollection([], {
                routeParameters: {
                    name: 'organization_users',
                    search_by_id: true
                }
            });

            var invitedUsersIds = this.calendarEvent.invitedUsers;
            if (invitedUsersIds && invitedUsersIds.length) {
                this.collection.setQuery(invitedUsersIds.join(','));
            } else {
                this.startButtonView.disable();
            }
        },

        onInvitesSync: function() {
            var invites = _.map(this.collection.toJSON(), function(item) {
                return {
                    id: item.email,
                    invite_type: 'EMAIL'
                };
            });

            this.startButtonView.setHangoutOptions({
                invites: invites
            });
            this.startButtonView.render();
        }
    });

    return CalendarEventStartHangoutComponent;
});
