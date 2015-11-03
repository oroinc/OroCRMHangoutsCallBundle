<?php

namespace OroCRM\Bundle\HangoutsCallBundle\Placeholder;

use Oro\Bundle\EntityBundle\ORM\DoctrineHelper;
use Oro\Bundle\SecurityBundle\SecurityFacade;
use Oro\Bundle\ConfigBundle\Config\ConfigManager;

class CalendarEventPlaceholderFilter
{
    const CALENDAR_EVENT_CLASS = 'Oro\Bundle\CalendarBundle\Entity\CalendarEvent';

    /** @var DoctrineHelper */
    protected $doctrineHelper;

    /** @var SecurityFacade */
    protected $securityFacade;

    /**
     * @var ConfigManager
     */
    protected $configManager;

    /**
     * @param DoctrineHelper $doctrineHelper
     * @param SecurityFacade $securityFacade
     * @param ConfigManager $configManager
     */
    public function __construct(
        DoctrineHelper $doctrineHelper,
        SecurityFacade $securityFacade,
        ConfigManager $configManager
    ) {
        $this->doctrineHelper = $doctrineHelper;
        $this->securityFacade = $securityFacade;
        $this->configManager  = $configManager;
    }

    /**
     * Check is "Start a Hangout" is applicable to Calendar Event
     *
     * @param object|null $entity
     * @return bool
     */
    public function isApplicable($entity = null)
    {
        return $this->configManager->get('oro_crm_hangouts_call.enable_google_hangouts') &&
            is_object($entity) &&
            // entity is calendar event
            $this->doctrineHelper->getEntityClass($entity) == self::CALENDAR_EVENT_CLASS &&
            // owner of the calendar is current user
            $entity->getCalendar()->getOwner() === $this->securityFacade->getLoggedUser() &&
            // calendar event has child events
            !$entity->getChildEvents()->isEmpty();
    }
}
