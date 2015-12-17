/*global gapi*/
(function() {
    'use strict';

    var startData = JSON.parse(atob(gapi.hangout.getStartData()));
    var iframeSrc = 'https://' + startData.host + '/' + startData.basePath + '/' + startData.iframe;

    document.body.insertAdjacentHTML('afterbegin',
        '<iframe class="proxy" src="' + iframeSrc + '" width="1" height="1" ' +
            'style="border-width:0;background-color:transparent;" />');
    var iframe = document.querySelector('iframe.proxy');

    function publishEvent(name, data) {
        var event = {
            token: startData.token,
            name: name,
            data: data
        };
        iframe.contentWindow.postMessage(event, iframeSrc);
    }

    iframe.onload = function() {
        publishEvent('application-start');
    };

    // Phone call tracking
    (function() {
        var phoneCallHandler = {
            /** @type {number|null} */
            _interval: null,

            /** @type {gapi.hangout.telephone.Call|null} */
            _call: null,

            /**
             * Starts tracking given call on state change
             *
             * @param {gapi.hangout.telephone.Call} call
             */
            track: function(call) {
                if (this._call) {
                    this.stopTracking();
                }
                this._call = call;
                if (this._call.getState().toUpperCase() === 'CONNECTED') {
                    this._onCallStart();
                }
                this._call.onCallStateChanged.add(this._onStateChange);
            },

            /**
             * Stops tracking current call
             */
            stopTracking: function() {
                if (this._call) {
                    this._call.onCallStateChanged.remove(this._onStateChange);
                    this._call = null;
                }
                this._resetInterval();
            },

            /**
             * Clears interval for 'call-is-going' event
             * @protected
             */
            _resetInterval: function() {
                clearInterval(this._interval);
                this._interval = null;
            },

            /**
             * Handles state change of phone call
             * @protected
             */
            _onStateChange: function(event) {
                switch (event.newState.toUpperCase()) {
                    case 'CONNECTED':
                        this._onCallStart();
                        break;
                    case 'DISCONNECTED':
                        this._onCallEnd();
                        break;
                    case 'RINGING':
                        this._resetInterval();
                        break;
                }
            },

            /**
             * Publishes event 'call-started' and sets interval handler to publish 'call-is-going'
             * @protected
             */
            _onCallStart: function() {
                var startedAt = new Date(Date.now() - this._call.getDuration());
                var call = this._call;
                publishEvent('call-started', {
                    startedAt: startedAt.toISOString(),
                    number: this._call.getPhoneNumber()
                });
                this._interval = setInterval(function() {
                    publishEvent('call-is-going', {
                        duration: call.getDuration()
                    });
                }, 1000);
            },

            /**
             * Publishes 'call-is-going' event and stops tracking a call
             * @protected
             */
            _onCallEnd: function() {
                if (this._call.getDuration()) {
                    publishEvent('call-ended', {
                        endedAt: (new Date()).toISOString(),
                        duration: this._call.getDuration()
                    });
                }
                this.stopTracking();
            }
        };
        phoneCallHandler._onStateChange = phoneCallHandler._onStateChange.bind(phoneCallHandler);

        // a call is already started
        var calls = gapi.hangout.telephone.getCalls();
        if (calls[0]) {
            phoneCallHandler.track(calls[0]);
        }

        // listening initiating a call
        gapi.hangout.telephone.onCallInitiated.add(function(e) {
            phoneCallHandler.track(e.callInformation);
        });
    })();

    // Other calls tracking
    (function() {
        var otherCallHandler = {
            /** @type {number|null} */
            interval: null,

            /**
             * Marks the call as started
             *  - triggers event of call start
             *  - starts interval of publishing 'call-is-going' event
             */
            start: function() {
                var startedAt = this.startedAt = new Date();
                if (this.isGoing()) {
                    this.end();
                }
                publishEvent('call-started', {
                    startedAt: startedAt.toISOString()
                });
                this.interval = setInterval(function() {
                    publishEvent('call-is-going', {
                        duration: (new Date()) - startedAt
                    });
                }, 1000);
            },

            /**
             * Marks the call as ended
             *  - triggers event of call end
             *  - clears interval of publishing 'call-is-going' event
             */
            end: function() {
                if (this.isGoing()) {
                    var endedAt = new Date();
                    publishEvent('call-ended', {
                        endedAt: endedAt.toISOString(),
                        duration: endedAt - this.startedAt
                    });
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

        gapi.hangout.onEnabledParticipantsChanged.add(function() {
            // participants without OroHangoutApp and person id not is empty (not phone call)
            var participants = gapi.hangout.getParticipants().filter(function(participant) {
                return participant.hasAppEnabled === false && participant.person.id !== '';
            });

            if (!otherCallHandler.isGoing() && participants.length) {
                otherCallHandler.start();
            } else if (otherCallHandler.isGoing() && !participants.length) {
                otherCallHandler.end();
            }
        });
    })();
})();
