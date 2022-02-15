<?php

namespace App\Events;

use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use Symfony\Component\Security\Core\Security;

class CustomersUserSubscriber implements EventSubscriberInterface
{

    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }


    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setUserForCutomer', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setUserForCutomer(GetResponseForControllerResultEvent $event)
    {
        $customer = $event->getControllerResult();
        $method = $event->getRequest()->getMethod(); // POST, GET, PUT, DELETE, ...


        if ($customer instanceof Customer && $method === "POST") {
            //choper l'utilisateur actuellement connecté
            $user = $this->security->getUser();
            //Assigner l'utilisateur  au customer qu'on est en train de créer
            $customer->setUser($user);
        }
    }
}
