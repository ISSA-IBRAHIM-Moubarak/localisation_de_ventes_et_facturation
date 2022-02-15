<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\CustomerRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Doctrine\ORM\Query\Expr\Func;

/**
 * @ORM\Entity(repositoryClass=CustomerRepository::class)
 * @ApiResource(
 * normalizationContext={
 *      "groups"={"customers_read"}
 * })
 * @ApiFilter(SearchFilter::class)
 * @ApiFilter(OrderFilter::class)
 */
class Customer
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"customers_read", "invoices_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read"})
     * @Assert\Length(min="3", minMessage="Le prénom du client doit faire entrre 3 et 255 caractères",
     * max="255", maxMessage="Le prénom du client doit faire entrre 3 et 255 caractères")
     * @Assert\NotBlank(message="Le prénom du client est obligatoire")
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read"})
     * @Assert\Length(min="3", minMessage="Le nom de famille du client doit faire entrre 3 et 255 caractères",
     * max="255", maxMessage="Le nom de famille du client doit faire entrre 3 et 255 caractères")
     * @Assert\NotBlank(message="Le nom de famille du client est obligatoire")
     */
    private $lastName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read"})
     * @Assert\NotBlank(message="L'adresse email du client est obligatoire")
     * @Assert\Email(message="Le format de l'adresse email doit être valide")
     */
    private $email;


    /**
     * @ORM\OneToMany(targetEntity=Invoice::class, mappedBy="customer")
     * @Groups({"customers_read"})
     * @ApiSubresource
     */
    private $invoices;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="customer")
     * @Groups({"customers_read", "invoices_read"})
     * @Assert\NotBlank(message="L'utilisateur est obligatoire")
     */
    private $user;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read"})
     * @Assert\Type(type="numeric", message="Le numero de téléphone doit être un numerique !")
     * @Assert\NotBlank(message="Le numero de téléphone du client est obligatoire !")
     */
    private $contact;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $lng;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $lat;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $file;

    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }
    /**
     * Permet de récupérer le total des invoices
     * @Groups({"customers_read"})
     * @return float
     */
    public function getTotalAmount(): float
    {
        return array_reduce($this->invoices->toArray(), function ($total, $invoice) {
            return $total + $invoice->getAmount();
        }, 0);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }


    /**
     * @return Collection|Invoice[]
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->removeElement($invoice)) {
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getContact(): ?string
    {
        return $this->contact;
    }

    public function setContact(string $contact): self
    {
        $this->contact = $contact;

        return $this;
    }

    public function getLng(): ?float
    {
        return $this->lng;
    }

    public function setLng(?float $lng): self
    {
        $this->lng = $lng;

        return $this;
    }

    public function getLat(): ?float
    {
        return $this->lat;
    }

    public function setLat(?float $lat): self
    {
        $this->lat = $lat;

        return $this;
    }

    public function getFile(): ?string
    {
        return $this->file;
    }

    public function setFile(?string $file): self
    {
        $this->file = $file;

        return $this;
    }
}
