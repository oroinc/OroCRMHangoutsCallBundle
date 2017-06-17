UPGRADE FROM 2.2 to 2.3
=======================

- Class `Oro\Bundle\HangoutsCallBundle\Placeholder\CalendarEventPlaceholderFilter`
    - changed the constructor signature: parameter `SecurityFacade $securityFacade` was replaced with `TokenAccessorInterface $tokenAccessor`
    - property `securityFacade` was replaced with `tokenAccessor`
