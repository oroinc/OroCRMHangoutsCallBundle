/* global gapi */
define(function(require, exports, module) {
    'use strict';

    const $ = require('jquery');
    const _ = require('underscore');
    const scriptjs = require('scriptjs');
    const BaseView = require('oroui/js/app/views/base/view');
    const moduleConfig = require('module-config').default(module.id);

    const StartButtonView = BaseView.extend({
        className: 'start-hangout-button-placeholder',

        /** @type {Object} */
        hangoutOptions: null,

        /** @type {string|null} */
        token: null,

        /**
         * @inheritdoc
         */
        constructor: function StartButtonView(options) {
            StartButtonView.__super__.constructor.call(this, options);
        },

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
         * @param {string=} options.token - unique hash
         */
        initialize: function(options) {
            this.setHangoutOptions(_.result(options, 'hangoutOptions'));
            _.extend(this, _.pick(options, ['token']));
            StartButtonView.__super__.initialize.call(this, options);
        },

        /**
         * @inheritdoc
         */
        delegateEvents: function(events) {
            $(window).on('blur' + this.eventNamespace(), this.onWindowBlur.bind(this));
            return StartButtonView.__super__.undelegateEvents.call(this, events);
        },

        /**
         * @inheritdoc
         */
        undelegateEvents: function() {
            $(window).off(this.eventNamespace());
            return StartButtonView.__super__.undelegateEvents.call(this);
        },

        /**
         * @inheritdoc
         */
        remove: function() {
            $(window).off(this.eventNamespace());
            if (this.$iframeContainer) {
                this.$iframeContainer.find('iframe').off(this.eventNamespace());
                this.$iframeContainer.remove();
                delete this.$iframeContainer;
            }
            return StartButtonView.__super__.remove.call(this);
        },

        /**
         * @inheritdoc
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
            const options = _.extend({render: 'createhangout'}, this.hangoutOptions);
            const apps = moduleConfig.initialApps;

            if (!_.isEmpty(apps) && this.token) {
                const token = this.token;
                options.initial_apps = _.map(apps, function(item) {
                    const startData = {
                        token: token
                    };

                    if (item.base_path && moduleConfig.appHost) {
                        _.extend(startData, {
                            host: moduleConfig.appHost,
                            basePath: item.base_path,
                            app: 'app.js'
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
            this.$el.closest('.control-group').show();
        },

        /**
         * Disables the view
         */
        disable: function() {
            this.$el.addClass('disabled');
            this.$el.closest('.control-group').hide();
        },

        /**
         * @inheritdoc
         */
        render: function() {
            this.$el.empty();
            this._deferredRender();
            scriptjs('//apis.google.com/js/platform.js', this._render.bind(this));
            return this;
        },

        /**
         * Actual render methods, is executed once Google API is ready to use
         * @protected
         */
        _render: function() {
            if (this.disposed) {
                return;
            }

            if (!gapi || !gapi.hangout) {
                this.deferredRender.reject(new Error('Cannot load Google API lib'));
                delete this.deferredRender;
                return;
            }

            let $container;
            this.$iframeContainer = $container = $('<div style="display: none"/>');
            $('body').append($container);

            gapi.hangout.render($container[0], this.combineHangoutOptions());
            $container.find('iframe').one('load' + this.eventNamespace(), e => {
                this.$el.html(e.target);
                $container.remove();
                this._resolveDeferredRender();
            });
        },

        /**
         * Handles main window blur event
         */
        onWindowBlur: function() {
            const iframe = this.$('iframe')[0];
            /**
             * If "Start a Hangout" iframe get a focus -- assume it was a click
             * Trigger 'click' with delay
             *  - to give a time to start hangout dialog
             *  - in FF iframe is not activeElement yet at the time of main window get blur
             */
            _.delay(() => {
                if (iframe === window.document.activeElement) {
                    this.trigger('click');
                }
            }, 500);
        }
    });

    return StartButtonView;
});
