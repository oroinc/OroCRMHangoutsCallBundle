<?php

namespace Oro\Bundle\HangoutsCallBundle\Tests\Unit\DependencyInjection;

use Oro\Bundle\HangoutsCallBundle\DependencyInjection\Configuration;
use Symfony\Component\Config\Definition\Exception\InvalidConfigurationException;
use Symfony\Component\Config\Definition\Processor;

class ConfigurationTest extends \PHPUnit\Framework\TestCase
{
    private function processConfiguration(array $config): array
    {
        return (new Processor())->processConfiguration(new Configuration(), $config);
    }

    /**
     * @dataProvider dataProviderExceptionConfigTree
     */
    public function testExceptionConfigTree($config, $exception)
    {
        $this->expectException($exception);

        $this->processConfiguration([$config]);
    }

    public function dataProviderExceptionConfigTree(): array
    {
        return [
            'missing application id' => [
                [
                    'initial_apps' => [
                        ['app_name' => 'myApp'],
                    ]
                ],
                InvalidConfigurationException::class
            ],
            'incorrect application type' => [
                [
                    'initial_apps' => [
                        ['app_id' => '1000001', 'app_type' => 'MY_APP'],
                    ]
                ],
                InvalidConfigurationException::class
            ],
        ];
    }

    /**
     * @dataProvider dataProviderConfigTree
     */
    public function testConfigTree($config, $expected)
    {
        $processedConfig = $this->processConfiguration([$config]);
        unset($processedConfig['settings']);
        $this->assertEquals($expected, $processedConfig);
    }

    public function dataProviderConfigTree(): array
    {
        return [
            [
                [],
                [
                    'initial_apps' => [
                        [
                            'app_id' => '1088537665390',
                            'app_type' => 'LOCAL_APP',
                            'app_name' => 'OroHangoutsApp',
                            'base_path' => 'bundles/orohangoutscall/hangouts-app',
                        ]
                    ]
                ]
            ],
            [
                [
                    'initial_apps' => [
                        [
                            'app_id' => '100000001'
                        ]
                    ],
                ],
                [
                    'initial_apps' => [
                        [
                            'app_id' => '100000001',
                            'app_type' => 'ROOM_APP',
                        ]
                    ]
                ]
            ],
            [
                [
                    'initial_apps' => [
                        [
                            'app_id' => '100000001',
                            'app_type' => 'LOCAL_APP',
                            'app_name' => 'MyApp',
                            'base_path' => 'bundles/somebundle/my-hangouts-app',
                        ],
                        [
                            'app_id' => '100000002',
                            'app_type' => 'ROOM_APP',
                            'app_name' => 'ChessApp'
                        ]
                    ],
                ],
                [
                    'initial_apps' => [
                        [
                            'app_id' => '100000001',
                            'app_type' => 'LOCAL_APP',
                            'app_name' => 'MyApp',
                            'base_path' => 'bundles/somebundle/my-hangouts-app'
                        ],
                        [
                            'app_id' => '100000002',
                            'app_type' => 'ROOM_APP',
                            'app_name' => 'ChessApp'
                        ]
                    ]
                ]
            ],
        ];
    }
}
