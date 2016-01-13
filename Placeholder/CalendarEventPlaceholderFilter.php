<?php

namespace OroCRM\Bundle\HangoutsCallBundle\Placeholder;

use Oro\Bundle\EntityBundle\ORM\DoctrineHelper;
use Oro\Bundle\SecurityBundle\SecurityFacade;

class CalendarEventPlaceholderFilter
{
    const CALENDAR_EVENT_CLASS = 'Oro\Bundle\CalendarBundle\Entity\CalendarEvent';

    /** @var PlaceholderFilter */
    protected $placeholderFilter;

    /** @var DoctrineHelper */
    protected $doctrineHelper;

    /** @var SecurityFacade */
    protected $securityFacade;

    /**
     * @param PlaceholderFilter $placeholderFilter
     * @param DoctrineHelper $doctrineHelper
     * @param SecurityFacade $securityFacade
     */
    public function __construct(
        PlaceholderFilter $placeholderFilter,
        DoctrineHelper $doctrineHelper,
        SecurityFacade $securityFacade
    ) {
        $this->placeholderFilter = $placeholderFilter;
        $this->doctrineHelper    = $doctrineHelper;
        $this->securityFacade    = $securityFacade;
    }

    /**
     * Check is "Start a Hangout" is applicable to Calendar Event
     *
     * @param object|null $entity
     * @return bool
     */
    public function isApplicable($entity = null)
    {
        return $this->placeholderFilter->isEmailApplicable() &&
            is_object($entity) &&
            // entity is calendar event
            $this->doctrineHelper->getEntityClass($entity) == self::CALENDAR_EVENT_CLASS &&
            // event has a calendar and owner of this calendar is current user
            $entity->getCalendar() && $entity->getCalendar()->getOwner() === $this->securityFacade->getLoggedUser() &&
            // calendar event has child events
            !$entity->getChildEvents()->isEmpty() &&
            // hangout option should be allowed for this event
            $entity->getUseHangout() !== false;
    }
}