<?php

namespace Oro\Bundle\HangoutsCallBundle\Tests\Unit\DependencyInjection;

use Oro\Bundle\HangoutsCallBundle\DependencyInjection\OroHangoutsCallExtension;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class OroHangoutsCallExtensionTest extends \PHPUnit\Framework\TestCase
{
    public function testLoad(): void
    {
        $container = new ContainerBuilder();

        $extension = new OroHangoutsCallExtension();
        $extension->load([], $container);

        self::assertNotEmpty($container->getDefinitions());
        self::assertSame(
            [
                [
                    'settings' => [
                        'resolved' => true,
                        'enable_google_hangouts_for_email' => ['value' => true, 'scope' => 'app'],
                        'enable_google_hangouts_for_phone' => ['value' => true, 'scope' => 'app'],
                    ]
                ]
            ],
            $container->getExtensionConfig('oro_hangouts_call')
        );

        self::assertEquals(
            [
                [
                    'app_id' => '1088537665390',
                    'app_type' => 'LOCAL_APP',
                    'app_name' => 'OroHangoutsApp',
                    'base_path' => 'bundles/orohangoutscall/hangouts-app',
                ]
            ],
            $container->getParameter('oro_hangouts.initial_apps')
        );
    }
}
