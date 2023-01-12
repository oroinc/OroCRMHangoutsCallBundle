The upgrade instructions are available at [Oro documentation website](https://doc.oroinc.com/master/backend/setup/upgrade-to-new-version/).

The current file describes significant changes in the code that may affect the upgrade of your customizations.

## Changes in the Google Hangout package versions

- [5.0.0](#500-2022-01-26)
- [4.1.0](#410-2020-01-31)
- [4.0.0](#400-2019-07-31)
- [3.0.0](#300-2018-07-27)
- [2.3.0](#230-2017-07-28)
- [2.1.0](#210-2017-03-30)


## 5.0.0 (2022-01-26)
[Show detailed list of changes](incompatibilities-5-0.md)

## 4.1.0 (2020-01-31)

### Removed
* All `*.class` parameters were removed from the dependency injection container.

## 4.0.0 (2019-07-31)
[Show detailed list of changes](incompatibilities-4-0.md)

## 3.0.0 (2018-07-27)
[Show detailed list of changes](incompatibilities-3-0.md)

## 2.3.0 (2017-07-28)
[Show detailed list of changes](incompatibilities-2-3.md)

## 2.1.0 (2017-03-30)

### Changed
- The following services were marked as `private`:
    - `oro_hangouts_call.twig.hangoutscall_extension`
### Removed
- Removed the following parameters from DIC:
    - `oro_hangouts_call.twig.class`
