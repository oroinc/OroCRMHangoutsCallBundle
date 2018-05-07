<?php

namespace Oro\Bundle\HangoutsCallBundle\Migrations\Schema\v1_1;

use Doctrine\DBAL\Schema\Schema;
use Oro\Bundle\CalendarBundle\Entity\CalendarEvent;
use Oro\Bundle\EntityConfigBundle\Migration\UpdateEntityConfigFieldValueQuery;
use Oro\Bundle\HangoutsCallBundle\Form\UseHangoutCheckboxType;
use Oro\Bundle\MigrationBundle\Migration\Migration;
use Oro\Bundle\MigrationBundle\Migration\QueryBag;

class ReplaceFormAliases implements Migration
{
    /**
     * {@inheritdoc}
     */
    public function up(Schema $schema, QueryBag $queries)
    {
        $queries->addQuery(
            new UpdateEntityConfigFieldValueQuery(
                CalendarEvent::class,
                'use_hangout',
                'form',
                'form_type',
                UseHangoutCheckboxType::class,
                'oro_hangouts_call_use_hangout_checkbox_type'
            )
        );
    }
}
