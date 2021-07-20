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
    /** @var array */
    private $initialApps;

    public function __construct(array $initialApps)
    {
        $this->initialApps = $initialApps;
    }

    /**
     * Returns a list of functions to add to the existing list.
     *
     * @return array An array of functions
     */
    public function getFunctions()
    {
        return [
            new TwigFunction('get_hangoutscall_initail_apps', [$this, 'getInitialApps']),
        ];
    }

    /**
     * @return array
     */
    public function getInitialApps()
    {
        return $this->initialApps;
    }

    /**
     * Returns the name of the extension.
     *
     * @return string
     */
    public function getName()
    {
        return 'oro_hangoutscall_extension';
    }
}
