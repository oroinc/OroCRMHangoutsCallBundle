<?php

namespace OroCRM\Bundle\HangoutsCallBundle\Placeholder;

use Oro\Bundle\ConfigBundle\Config\ConfigManager;

class PlaceholderFilter
{
    /** @var ConfigManager */
    protected $configManager;

    /**
     * @param ConfigManager $configManager
     */
    public function __construct(ConfigManager $configManager) {
        $this->configManager  = $configManager;
    }

    /**
     * Check if HangoutsCall functionality is turned on
     *
     * @return bool
     */
    public function isApplicable()
    {
        return (bool)$this->configManager->get('oro_crm_hangouts_call.enable_google_hangouts');
    }
}
