<?php

namespace Oro\Bundle\HangoutsCallBundle\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

/**
 * Provides a Twig function to retrieve oro_hangouts.initial_apps container parameter value:
 *   - get_hangoutscall_initail_apps
 */
class OroHangoutsCallExtension extends AbstractExtension
{
    private array $initialApps;

    public function __construct(array $initialApps)
    {
        $this->initialApps = $initialApps;
    }

    /**
     * {@inheritdoc}
     */
    public function getFunctions()
    {
        return [
            new TwigFunction('get_hangoutscall_initail_apps', [$this, 'getInitialApps']),
        ];
    }

    public function getInitialApps(): array
    {
        return $this->initialApps;
    }
}
