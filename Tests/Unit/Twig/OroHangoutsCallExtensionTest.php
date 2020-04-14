<?php

namespace Oro\Bundle\HangoutsCallBundle\Tests\Unit\Twig;

use Oro\Bundle\HangoutsCallBundle\Twig\OroHangoutsCallExtension;
use Oro\Component\Testing\Unit\TwigExtensionTestCaseTrait;

class OroHangoutsCallExtensionTest extends \PHPUnit\Framework\TestCase
{
    use TwigExtensionTestCaseTrait;

    /** @var OroHangoutsCallExtension */
    protected $extension;

    /** @var array */
    protected $initialAppsParameter = [['app_id' => '100000000001']];

    protected function setUp(): void
    {
        $this->extension = new OroHangoutsCallExtension($this->initialAppsParameter);
    }

    public function testGetInitialApps()
    {
        $this->assertEquals(
            $this->initialAppsParameter,
            self::callTwigFunction($this->extension, 'get_hangoutscall_initail_apps', [])
        );
    }

    public function testGetName()
    {
        $this->assertEquals('oro_hangoutscall_extension', $this->extension->getName());
    }
}
