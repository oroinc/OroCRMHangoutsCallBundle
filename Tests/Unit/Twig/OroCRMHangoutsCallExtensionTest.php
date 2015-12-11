<?php
namespace OroCRM\Bundle\HangoutsCallBundle\Tests\Unit\Twig;

use OroCRM\Bundle\HangoutsCallBundle\Twig\OroCRMHangoutsCallExtension;

class OroCRMHangoutsCallExtensionTest extends \PHPUnit_Framework_TestCase
{
    protected $functions = array(
        'get_hangoutscall_initail_apps' => [
            ['app_id' => '100000000001']
        ],
    );

    protected $parameters = array(
        array('oro_crm_hangouts_call.initial_apps', [
            ['app_id' => '100000000001']
        ])
    );

    public function testGetFunctions()
    {
        $container = $this->getMock('Symfony\Component\DependencyInjection\ContainerInterface');
        $container->expects($this->any())
            ->method('getParameter')
            ->will($this->returnValueMap($this->parameters));

        $extension = new OroCRMHangoutsCallExtension($container);

        /** @var \Twig_SimpleFunction[] $functions */
        $functions = $extension->getFunctions();
        foreach ($functions as $function) {
            $this->assertInstanceOf('\Twig_SimpleFunction', $function);
            $this->assertArrayHasKey($function->getName(), $this->functions);
            $this->assertEquals(
                $this->functions[$function->getName()],
                call_user_func($function->getCallable())
            );
        }
    }

    public function testGetName()
    {
        $container = $this->getMock('Symfony\Component\DependencyInjection\ContainerInterface');
        $extension = new OroCRMHangoutsCallExtension($container);
        $this->assertEquals('orocrm_hangoutscall_extension', $extension->getName());
    }
}
