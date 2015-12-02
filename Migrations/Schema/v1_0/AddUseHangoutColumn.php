<?php

namespace OroCRM\Bundle\HangoutsCallBundle\Migrations\Schema\v1_0;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\DBAL\Schema\SchemaException;

use Oro\Bundle\EntityExtendBundle\EntityConfig\ExtendScope;
use Oro\Bundle\MigrationBundle\Migration\Migration;
use Oro\Bundle\MigrationBundle\Migration\QueryBag;

class AddUseHangoutColumn implements Migration
{
    /**
     * @inheritdoc
     */
    public function up(Schema $schema, QueryBag $queries)
    {
        self::useHangoutColumn($schema);
    }

    /**
     * @param Schema   $schema
     * @throws SchemaException
     */
    public static function useHangoutColumn(Schema $schema)
    {
        $table = $schema->getTable('oro_calendar_event');
        $table->addColumn(
            'use_hangout',
            'boolean',
            [
                'oro_options' => [
                    'extend'       => ['owner' => ExtendScope::OWNER_CUSTOM],
                    'form'         => ['is_enabled' => true, 'form_type' => 'checkbox'],
                    'datagrid'     => ['is_visible' => false],
                ],
                'notnull'     => false,
            ]
        );
    }
}
