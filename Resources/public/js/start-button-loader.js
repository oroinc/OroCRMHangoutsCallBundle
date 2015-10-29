/*global gapi*/
define(function(require) {
    'use strict';

    var $ = require('jquery');

    function startHangoutButtonFactory(options) {

        var initButtonDeferred = $.Deferred();
        require(['//apis.google.com/js/platform.js'], function() {
            if (!gapi || !gapi.hangout) {
                initButtonDeferred.reject(new Error('Cannot load Google API lib'));
                return;
            }

            var $container = $('<div style="display: none"/>');
            $('body').append($container);

            gapi.hangout.render($container[0], $.extend(options, {
                render: 'createhangout'
            }));

            $container.find('iframe').one('load', function(e) {
                initButtonDeferred.resolve(this);
                $container.remove();
            });
        });

        return initButtonDeferred.promise();
    }

    return startHangoutButtonFactory;
});
