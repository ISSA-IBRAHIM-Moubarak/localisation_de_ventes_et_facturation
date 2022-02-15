<?php

namespace App\Events;

use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;

class InvoiceChronoSubscriber implements EventSubscriberInterface
{

    private $security;
    private $repository;

    public function __construct(Security $security, InvoiceRepository $repository)
    {
        $this->security = $security;
        $this->repository = $repository;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(GetResponseForControllerResultEvent $event)
    {
        //dd($event->getControllerResult());
        //dd($this->repository->findNextChrono($this->security->getUser()));
        //1. J'ai besoin de l'utilisateur actuellement connecté (security)
        //2. J'ai besoin de repository des factures (InvoicesRepository)
        //3. Choper la dernèier facture qui à été insérée, et choper son chrono
        //4. Dans cette nouvelle facture, on donne le dernier chrono + 1

        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod(); // POST, GET, PUT, DELETE, ...

        if ($invoice instanceof Invoice && $method === "POST") {

            $nextChrono = $this->repository->findNextChrono($this->security->getUser());
            $invoice->setChrono($nextChrono);
            //dd($invoice);

            //TODO : A deplacer dans la classe dediée
            if (empty($invoice->getSentAt())) {
                $invoice->setSentAt(new \DateTime());
            }
        }
    }
}
