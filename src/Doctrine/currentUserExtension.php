<?php

namespace App\Doctrine;

use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class currentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{

    private $security;
    private $auth;

    public function __construct(Security $security, AuthorizationCheckerInterface $checker)
    {
        $this->security = $security;
        $this->auth = $checker;
    }

    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass)
    {
        //1. Obtenir l'utilisateur actuellement connecté (security)
        $user = $this->security->getUser();
        //2. Si on demande des invoices ou des customers alors, agir sur le requête pour qu'elle tienne compte l'utilisateur connecté
        if (($resourceClass === Customer::class || $resourceClass === Invoice::class) && !$this->auth->isGranted('ROLE_ADMIN') && $user instanceof User) {
            //dd($queryBuilder());
            $rootAllias = $queryBuilder->getRootAliases()[0];
            //dd($rootAllias);

            if ($resourceClass === Customer::class) {
                $queryBuilder->andWhere("$rootAllias.user = :user");
            } else if ($resourceClass === Invoice::class) {
                $queryBuilder->join("$rootAllias.customer", "c")
                             ->andWhere("c.user = :user");
            }

            $queryBuilder->setParameter("user", $user);

            //dd($queryBuilder);


        }
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?string $operationName = null)
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, ?string $operationName = null, array $context = [])
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }
}
