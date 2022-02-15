<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ArticleRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints\Type;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;


/**
 * @ORM\Entity(repositoryClass=ArticleRepository::class)
 * @ApiResource(
 *  attributes={
 *      "pagination_enabled"=false,
 *      "pagination_items_per_page"=20 
 * },
 * normalizationContext={"groups"={"articles_read"}},
 * denormalizationContext={"disable_type_enforcement"=true}
 * )
 * @ApiFilter(SearchFilter::class)
 * @ApiFilter(OrderFilter::class)
 */
class Article
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"articles_read", "invoices_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"articles_read", "invoices_read"})
     * @Assert\NotBlank(message="Le libellé du produit est obligatoire")
     * @Assert\Length(min="3", minMessage="Le libellé du produit doit faire entrre 3 et 50 caractères",
     * max="50", maxMessage="Le libellé du produit doit faire entrre 3 et 50 caractères")
     */
    private $title;

    
    /**
     * @ORM\ManyToMany(targetEntity=Invoice::class, inversedBy="articles")
     * @Groups({"articles_read"})
     */
    private $invoices;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="articles")
     * @Groups({"articles_read", "invoices_read"})
     */
    private $user;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"articles_read", "invoices_read"})
     */
    private $description;

    /**
     * @ORM\Column(type="float")
     * @Groups({"articles_read", "invoices_read"})
     * @Assert\Type(type="numeric", message="Le prix unitaire du produit doit être un numerique !")
     * @Assert\NotBlank(message="Le prix unitaire du produit est obligatoire !")
     */
    private $price;

     /**
     * @ORM\Column(type="float")
     * @Groups({"articles_read", "invoices_read"})
     * @Assert\Type(type="numeric", message="La quantité du produit doit être un numerique !")
     * @Assert\NotBlank(message="La quantité du produit est obligatoire !")
     */
    private $quantity;

     /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"articles_read"})
     */
    public $path;

    /**
     * @Assert\File(maxSize="6000000")
     * @Groups({"articles_read"})
     */
    private $file;


    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

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
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        $this->invoices->removeElement($invoice);

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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice($price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getQuantity(): ?float
    {
        return $this->quantity;
    }

    public function setQuantity($quantity): self
    {
        $this->quantity = $quantity;

        return $this;
    }

    //partie photo
    public function getAbsolutePath()
    {
        return null === $this->path
            ? null
            : $this->getUploadRootDir() . '/' . $this->path;
    }

    public function getWebPath()
    {
        return null === $this->path
            ? null
            : $this->getUploadDir() . '/' . $this->path;
    }

    protected function getUploadRootDir()
    {
        // the absolute directory path where uploaded
        // documents should be saved
        return __DIR__ . '/../../public/' . $this->getUploadDir();
    }

    protected function getUploadDir()
    {
        // get rid of the __DIR__ so it doesn't screw up
        // when displaying uploaded doc/image in the view.
        return 'uploads/photoArticles';
    }

    /**
     * Sets file.
     *
     * @param UploadedFile $file
     */
    public function setFile(UploadedFile $file = null)
    {
        $this->file = $file;
    }

    /**
     * Get file.
     *
     * @return UploadedFile
     */
    public function getFile()
    {
        return $this->file;
    }



    /**
     * Set path
     *
     * @param string $path
     *
     * @return Article
     */
    public function setPath($path)
    {
        $this->path = $path;

        return $this;
    }

    /**
     * Get path
     *
     * @return string
     */
    public function getPath()
    {
        return $this->path;
    }

    public function upload()
    {
        // the file property can be empty if the field is not required
        if (null === $this->getFile()) {
            return;
        }

        // use the original file name here but you should
        // sanitize it at least to avoid any security issues

        // move takes the target directory and then the
        // target filename to move to
        $this->getFile()->move(
            $this->getUploadRootDir(),
            $this->getFile()->getClientOriginalName()
        );

        // set the path property to the filename where you've saved the file
        $this->path = $this->getFile()->getClientOriginalName();

        // clean up the file property as you won't need it anymore
        $this->file = null;
    }

}
