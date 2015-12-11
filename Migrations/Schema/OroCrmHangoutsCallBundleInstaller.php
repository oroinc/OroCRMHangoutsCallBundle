<?php

namespace OroCRM\Bundle\HangoutsCallBundle\Migrations\Schema;

use Doctrine\DBAL\Schema\Schema;

use Oro\Bundle\MigrationBundle\Migration\Installation;
use Oro\Bundle\MigrationBundle\Migration\QueryBag;

use OroCRM\Bundle\HangoutsCallBundle\Migrations\Schema\v1_0\AddUseHangoutColumn;

class OroCrmHangoutsCallBundleInstaller implements Installation
{
    /**
     * {@inheritdoc}
     */
    public function getMigrationVersion()
    {
        return 'v1_0';
    }

    /**
     * {@inheritdoc}
     */
    public function up(Schema $schema, QueryBag $queries)
    {
        AddUseHangoutColumn::useHangoutColumn($schema);
    }
}
