<?php

namespace OroCRM\Bundle\HangoutsCallBundle\Placeholder;

use Oro\Bundle\EntityBundle\ORM\DoctrineHelper;
use Oro\Bundle\SecurityBundle\SecurityFacade;

class CalendarEventPlaceholderFilter
{
    const CALENDAR_EVENT_CLASS = 'Oro\Bundle\CalendarBundle\Entity\CalendarEvent';

    /** @var DoctrineHelper */
    protected $doctrineHelper;

    /** @var SecurityFacade */
    protected $securityFacade;

    /**
     * @param DoctrineHelper $doctrineHelper
     * @param SecurityFacade $securityFacade
     */
    public function __construct(DoctrineHelper $doctrineHelper, SecurityFacade $securityFacade) {
        $this->doctrineHelper = $doctrineHelper;
        $this->securityFacade = $securityFacade;
    }

    /**
     * Check is "Start a Hangout" is applicable to Calendar Event
     *
     * @param object|null $entity
     * @return bool
     */
    public function isApplicable($entity = null)
    {
        return is_object($entity) &&
            // entity is calendar event
            $this->doctrineHelper->getEntityClass($entity) == self::CALENDAR_EVENT_CLASS &&
            // owner of the calendar is current user
            $entity->getCalendar()->getOwner() === $this->securityFacade->getLoggedUser() &&
            // calendar event has child events
            !$entity->getChildEvents()->isEmpty();
    }
}
