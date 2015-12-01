/*global gapi*/
define(function(require) {
    'use strict';

    var StartButtonView;

    var $ = require('jquery');
    var _ = require('underscore');
    var BaseView = require('oroui/js/app/views/base/view');
    var HangoutsEventBroker = require('orocrmhangoutscall/js/hangouts-event-broker');
    var moduleConfig = require('module').config();

    StartButtonView = BaseView.extend({
        className: 'start-hangout-button-placeholder',

        /** @type {Object} */
        hangoutOptions: null,

        /** @type {HangoutsEventBroker} */
        eventBroker: null,

        /**
         * @param {Object} options
         * @param {Object} options.hangoutOptions - options for "Start a Hangout" button
         * @param {string} options.hangoutOptions.topic - Pre-populates the topic field for Hangouts on Air.
         *     Note that users can change the topic of the Hangout after they have joined.
         * @param {Array<{id: string, invite_type: 'PROFILE'|'CIRCLE'|'EMAIL'|'PHONE'}>} options.hangoutOptions.invites
         *     - This array of JavaScript objects specifies the list of people to invite
         *     when the user clicks the Hangout button. Invalid objects and parameters are ignored.
         * @param {Array<{app_id: string, start_data: string, app_type: string }>} options.hangoutOptions.initial_apps
         *     - This optional parameter specifies the type of Hangout app created when the user clicks the button.
         *     Setting this parameter changes the way that Hangout applications are loaded for the Hangout
         *     and its participants. The following values are supported:
         *         LOCAL_APP - Launches the app for only the user who clicks the widget.
         *         ROOM_APP - (Default) Launches the app for every participant who joins the Google+ Hangout.
         * @param {'normal'|'onair'|'party'|'moderated'} options.hangoutOptions.hangout_type - Specifies what type
         *     of Hangout should be started.
         *     normal - (Default) Launch the Hangout app without broadcasting to YouTube or starting a Hangout party.
         *     onair - Launch the Hangout to be broadcast on YouTube as a Hangout On Air.
         *     party - Launch the Hangout app as a Hangout party.
         *     moderated -Launch the Hangout app with Control Room enabled.
         * @param {number} options.hangoutOptions.widget_size - Specifies the width of the button.
         *     The default value is 136.
         */
        initialize: function(options) {
            this.setHangoutOptions(_.result(options, 'hangoutOptions'));
            this.eventBroker = new HangoutsEventBroker({
                listen: {
                    all: _.bind(this.trigger, this)
                }
            });
            StartButtonView.__super__.initialize.call(this, options);
        },

        dispose: function() {
            if (this.disposed) {
                return;
            }
            if (this.eventBroker) {
                this.eventBroker.dispose();
            }
            StartButtonView.__super__.dispose.apply(this);
        },

        /**
         * @inheritDoc
         */
        _ensureElement: function() {
            StartButtonView.__super__._ensureElement.call(this);
            if (this.className) {
                this.$el.addClass(_.result(this, 'className'));
            }
        },

        /**
         * Updates hangout options
         *
         * @param {Object} options
         */
        setHangoutOptions: function(options) {
            this.hangoutOptions = options || {};
        },

        /**
         * Combines options for start hangout button
         */
        combineHangoutOptions: function() {
            var token = this.eventBroker.getToken();
            var options = _.extend({render: 'createhangout'}, this.hangoutOptions);
            var apps = moduleConfig.initialApps;

            if (!_.isEmpty(apps)) {
                options.initial_apps = _.map(apps, function(item) {
                    var startData = {
                        token: token
                    };

                    if (item.base_path && moduleConfig.appHost) {
                        _.extend(startData, {
                            host: moduleConfig.appHost,
                            basePath: item.base_path,
                            app: 'app.js',
                            iframe: 'iframe.html'
                        });
                    }

                    return {
                        app_id: item.app_id,
                        start_data: btoa(JSON.stringify(startData)),
                        app_type: item.app_type ? item.app_type : 'ROOM_APP'
                    };
                });
            }

            return options;
        },

        /**
         * Enable the view
         */
        enable: function() {
            this.$el.removeClass('disabled');
        },

        /**
         * Disables the view
         */
        disable: function() {
            this.$el.addClass('disabled');
        },

        /**
         * @inheritDoc
         */
        render: function() {
            this.$el.empty();
            this._deferredRender();
            require(['//apis.google.com/js/platform.js'], _.bind(this._render, this));
            return this;
        },

        /**
         * Actual render methods, is executed once Google API is ready to use
         * @protected
         */
        _render: function() {
            if (!gapi || !gapi.hangout) {
                this.deferredRender.reject(new Error('Cannot load Google API lib'));
                delete this.deferredRender;
                return;
            }

            var $container = $('<div style="display: none"/>');
            $('body').append($container);

            gapi.hangout.render($container[0], this.combineHangoutOptions());

            $container.find('iframe').one('load', _.bind(function(e) {
                this.$el.html(e.target);
                $container.remove();
                this._resolveDeferredRender();
            }, this));
        }
    });

    return StartButtonView;
});
