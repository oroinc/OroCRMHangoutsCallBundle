<?php

namespace Oro\Bundle\HangoutsCallBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UseHangoutCheckboxType extends AbstractType
{
    const NAME = 'oro_hangouts_call_use_hangout_checkbox_type';

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return $this->getBlockPrefix();
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return self::NAME;
    }

    /**
     * {@inheritdoc}
     */
    public function getParent()
    {
        return CheckboxType::class;
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(['tooltip' => 'oro.calendar.calendarevent.use_hangout.tooltip']);
    }
}
