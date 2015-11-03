<?php

namespace OroCRM\Bundle\HangoutsCallBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;
use Oro\Bundle\ConfigBundle\DependencyInjection\SettingsBuilder;

/**
 * This is the class that validates and merges configuration from your app/config files
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritDoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode    = $treeBuilder->root('oro_crm_hangouts_call');
        SettingsBuilder::append($rootNode, [
            'enable_google_hangouts' => [
                'value' => true,
                'type' => 'boolean',
            ]
        ]);
        return $treeBuilder;
    }
}
