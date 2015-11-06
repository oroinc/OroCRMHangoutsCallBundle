<?php

namespace OroCRM\Bundle\HangoutsCallBundle\Placeholder;

use Oro\Bundle\ConfigBundle\Config\ConfigManager;
use Oro\Bundle\UIBundle\Provider\UserAgentProvider;

class PlaceholderFilter
{
    /** @var ConfigManager */
    protected $configManager;

    /** @var UserAgentProvider */
    protected $userAgentProvider;

    /**
     * @param ConfigManager $configManager
     * @param UserAgentProvider $userAgentProvider
     */
    public function __construct(ConfigManager $configManager, UserAgentProvider $userAgentProvider) {
        $this->configManager  = $configManager;
        $this->userAgentProvider  = $userAgentProvider;
    }

    /**
     * Check if HangoutsCall functionality is turned on
     *
     * @return bool
     */
    public function isApplicable()
    {
        // hangouts call functionality is enabled in system configuration and it is desktop client
        return (bool)$this->configManager->get('oro_crm_hangouts_call.enable_google_hangouts') &&
            $this->userAgentProvider->getUserAgent()->isDesktop();
    }
}
