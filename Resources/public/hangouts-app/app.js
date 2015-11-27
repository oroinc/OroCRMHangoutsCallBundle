/*global gapi*/
(function() {
    'use strict';

    var startData = JSON.parse(atob(gapi.hangout.getStartData()));
    var iframeSrc = 'https://' + startData.host + '/' + startData.basePath + '/' + startData.iframe;

    document.body.insertAdjacentHTML('afterbegin',
        '<iframe class="proxy" src="' + iframeSrc + '" style="visibility: hidden" />');
    var iframe = document.querySelector('iframe.proxy');

    function publishEvent(name, data) {
        var event = {
            token: startData.token,
            name: name,
            data: data
        };
        iframe.contentWindow.postMessage(event, iframeSrc);
    }

    var call = {
        /** @type {number|null} */
        interval: null,

        /**
         * Marks the call as started
         *  - triggers event of call start
         *  - starts interval of publishing 'call-is-going' event
         */
        start: function(number) {
            if (this.isGoing()) {
                this.stop();
            }
            publishEvent('call-started', {
                number: number
            });
            this.interval = setInterval(function() {
                publishEvent('call-is-going');
            }, 1000);
        },

        /**
         * Marks the call as ended
         *  - triggers event of call end
         *  - clears interval of publishing 'call-is-going' event
         */
        end: function() {
            if (this.isGoing()) {
                publishEvent('call-ended');
                clearInterval(this.interval);
                this.interval = null;
            }
        },

        /**
         * Checks if there's going a call
         *
         * @return {boolean}
         */
        isGoing: function() {
            return this.interval !== null;
        }
    };

    iframe.onload = function() {
        publishEvent('application-start');
    };

    // handles enabled participant changes
    gapi.hangout.onEnabledParticipantsChanged.add(function() {
        // filter only phone participants
        var phoneParticipants = gapi.hangout.getParticipants().filter(function(participant) {
            // phone participant has empty id
            return participant.hasAppEnabled === false && participant.person.id === '';
        });

        if (!call.isGoing()) {
            if (phoneParticipants.length && phoneParticipants[0].person.displayName) {
                call.start(phoneParticipants[0].person.displayName);
            }
        } else {
            call.end();
        }
    });
})();
