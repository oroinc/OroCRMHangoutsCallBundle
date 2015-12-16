define(function(require) {
    'use strict';

    var CalendarEventStartHangoutComponent;
    var _ = require('underscore');
    var StartButtonView = require('../views/start-button-view');
    var CalendarEventGuestCollection = require('orocalendar/js/app/models/calendar-event/guest-collection');
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
            _.extend(this, _.defaults(_.pick(options, ['calendarEvent', 'hangoutOptions']), {
                hangoutOptions: {}
            }));
            if (!this.calendarEvent) {
                throw new TypeError('Missing required option "calendarEvent"');
            }

            this.startButtonView = new StartButtonView({
                el: options._sourceElement,
                hangoutOptions: this.hangoutOptions
            });

            // collection of invited users
            this.collection = new CalendarEventGuestCollection([], {
                routeParameters: {
                    id: this.calendarEvent.id.substr(this.calendarEvent.calendarUid.length + 1)
                }
            });

            var invitedUsersIds = this.calendarEvent.invitedUsers;
            if (invitedUsersIds && invitedUsersIds.length) {
                this.collection.fetch();
            } else {
                this.startButtonView.disable();
            }
        },

        onInvitesSync: function() {
            var guests = this.collection.filter(function(guest) {
                return guest.get('invitationStatus') !== 'declined';
            });
            var invites = _.map(guests, function(item) {
                return {
                    id: item.get('email'),
                    invite_type: 'EMAIL'
                };
            });

            this.startButtonView.setHangoutOptions(_.extend({}, this.hangoutOptions, {
                invites: invites
            }));
            this.startButtonView.render();
        }
    });

    return CalendarEventStartHangoutComponent;
});
