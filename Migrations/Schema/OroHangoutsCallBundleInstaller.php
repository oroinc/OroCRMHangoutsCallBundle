<?php

namespace Oro\Bundle\HangoutsCallBundle\Migrations\Schema;

use Doctrine\DBAL\Schema\Schema;
use Oro\Bundle\HangoutsCallBundle\Migrations\Schema\v1_0\AddUseHangoutColumn;
use Oro\Bundle\MigrationBundle\Migration\Installation;
use Oro\Bundle\MigrationBundle\Migration\QueryBag;

class OroHangoutsCallBundleInstaller implements Installation
{
    /**
     * {@inheritdoc}
     */
    public function getMigrationVersion()
    {
        return 'v1_1';
    }

    /**
     * {@inheritdoc}
     */
    public function up(Schema $schema, QueryBag $queries)
    {
        AddUseHangoutColumn::useHangoutColumn($schema);
    }
}
