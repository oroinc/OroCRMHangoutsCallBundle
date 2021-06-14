The upgrade instructions are available at [Oro documentation website](https://doc.oroinc.com/backend/setup/upgrade-to-new-version/).

The current file describes significant changes in the code that may affect the upgrade of your customizations.

## 4.1.0-beta (2019-09-30)

### Removed
* All `*.class` parameters were removed from the dependency injection container.

## 4.0.0 (2019-07-31)
[Show detailed list of changes](incompatibilities-4-0.md)

## 3.0.0-beta (2018-03-30)
[Show detailed list of changes](incompatibilities-3-0-beta.md)

## 2.3.0 (2017-07-28)
[Show detailed list of changes](incompatibilities-2-3.md)

## 2.1.0 (2017-03-30)
### Changed
- The following services were marked as `private`:
    - `oro_hangouts_call.twig.hangoutscall_extension`
### Removed
- Removed the following parameters from DIC:
    - `oro_hangouts_call.twig.class`
