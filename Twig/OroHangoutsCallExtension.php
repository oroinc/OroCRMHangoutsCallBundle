<?php

namespace Oro\Bundle\HangoutsCallBundle\Twig;

use Symfony\Component\DependencyInjection\ContainerInterface;

class OroHangoutsCallExtension extends \Twig_Extension
{
    /**
     * @var \Symfony\Component\DependencyInjection\ContainerInterface
     */
    protected $container;

    /**
     * @param ContainerInterface $container
     */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * Returns a list of functions to add to the existing list.
     *
     * @return array An array of functions
     */
    public function getFunctions()
    {
        $container = $this->container;
        return array(
            new \Twig_SimpleFunction('get_hangoutscall_initail_apps', function () use ($container) {
                return $container->getParameter('oro_hangouts.initial_apps');
            }),
        );
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
