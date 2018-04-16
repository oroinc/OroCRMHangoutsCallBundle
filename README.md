# OroHangoutsCallBundle

OroHangoutsCallBundle provides integration with [Google Hangouts](https://hangouts.google.com/) for Oro applications and enables users to appoint Google Hangout calls for [Calendar Events](https://github.com/oroinc/OroCalendarBundle).

The bundle enables developers to configure default Google Hangout integration data in application parameters in YAML files and helps admin users to enable invite for Google hangout calls by phone and email in [System Configuration](https://github.com/oroinc/platform/tree/master/src/Oro/Bundle/ConfigBundle) UI.

## Overview

By default into "Start a Hangout" button is added information to start OroHangoutApp within Google Hangouts call.
(see more information about [Hangouts button configuration](https://developers.google.com/+/hangouts/button))

It is possible to setup other application (or even several applications) to start within Google Hangouts call over configuration file:
```yml
oro_hangouts_call:
    initial_apps:
        - app_id: 1088XXXXX90       # application id code
          app_type: 'LOCAL_APP'
          app_name: 'MyApplication'
```

Or turn off starting any application at all
```yml
oro_hangouts_call:
    initial_apps: []
```
