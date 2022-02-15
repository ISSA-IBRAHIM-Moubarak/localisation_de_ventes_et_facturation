<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\InvoiceRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;

use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;


/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 * @ApiResource(
 * attributes={
 *      "pagination_enabled"=false,
 *      "pagination_items_per_page"=20,
 *      "order": {"amount":"desc"} },
 * normalizationContext={"groups"={"invoices_read"}},
 * denormalizationContext={"disable_type_enforcement"=true}
 * )
 * @ApiFilter(OrderFilter::class, properties={"amount", "sentAt"})
 * 
 */
class Invoice
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read"})
     * 
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read", "customers_read"})
     * @Assert\Type(type="numeric", message="Le montant de la facture doit être un numerique !")
     * @Assert\NotBlank(message="Le montant de la facture est obligatoire !")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read", "customers_read"})
     * @Assert\DateTime(message="La date doit être au format YYYY-MM-DD")
     * @Assert\NotBlank(message="La date d'envoi de la facture doit être renseignée !")
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read", "customers_read"})
     * @Assert\NotBlank(message="Le statut de la facture est obligatoire !")
     * @Assert\Choice(choices={"SENT", "PAID", "CANCELLED"}, message="Le statut doit être SENT, PAID ou CANCELED !")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\NotBlank(message="Le client de la facture être renseigné !")
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read"})
     * @Assert\NotBlank(message="Le chrono de la facture être renseigné !")
     * @Assert\Type(type="integer", message="Le chrono doit être un nombre !")
     */
    private $chrono;

    /**
     * @ORM\ManyToMany(targetEntity=Article::class, mappedBy="invoices")
     * @Groups({"invoices_read"})
     */
    private $articles;

   
    public function __construct()
    {
        $this->articles = new ArrayCollection();
    }

     /**
     * Permet de récupérer le total des invoices
     * @Groups({"invoices_read"})
     * @return float
     */
    public function getMontant(): float
    {
        return array_reduce($this->articles->toArray(), function ($quantity, $article) {
            return $quantity * $article->getPrice();
        }, 0);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }

    /**
     * @return Collection|Article[]
     */
    public function getArticles(): Collection
    {
        return $this->articles;
    }

    public function addArticle(Article $article): self
    {
        if (!$this->articles->contains($article)) {
            $this->articles[] = $article;
            $article->addInvoice($this);
        }

        return $this;
    }

    public function removeArticle(Article $article): self
    {
        if ($this->articles->removeElement($article)) {
            $article->removeInvoice($this);
        }

        return $this;
    }
    
}
