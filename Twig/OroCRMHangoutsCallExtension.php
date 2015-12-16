<?php

namespace OroCRM\Bundle\HangoutsCallBundle\Twig;

use Symfony\Component\DependencyInjection\ContainerInterface;

class OroCRMHangoutsCallExtension extends \Twig_Extension
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
                return $container->getParameter('oro_crm_hangouts_call.initial_apps');
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
        return 'orocrm_hangoutscall_extension';
    }
}
