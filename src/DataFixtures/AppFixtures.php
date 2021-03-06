<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\User;
use App\Entity\Article;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * l'encodeur de mot de passe
     *
     * @param UserPasswordEncoderInterface $encoder
     */
    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');


        for ($u = 0; $u < 10; $u++) {

            $user = new User;

            $chrono = 1;
            $hash = $this->encoder->encodePassword($user, "password");

            $user->setFirstName($faker->firstName())
                ->setLastName($faker->lastName)
                ->setEmail($faker->email)
                ->setPassword($hash);

            $manager->persist($user);

            for ($a = 0; $a < mt_rand(7, 20); $a++) {
                $article = new Article;
                $article->setTitle($faker->title())
                    ->setPrice($faker->randomFloat(2, 250, 10000))
                    ->setCommentaire('test')
                    ->setQuantity('10')
                    ->setUser($user);

                $manager->persist($article);
            }

            for ($c = 0; $c < mt_rand(7, 20); $c++) {
                $customer = new Customer;
                $customer->setFirstName($faker->firstName())
                    ->setLastName($faker->lastName)
                    ->setEmail($faker->email)
                    ->setContact('90909090')
                    ->setUser($user)
                    ->setLng('2.105278')
                    ->setLat('13.521389');

                $manager->persist($customer);

                for ($i = 0; $i < mt_rand(3, 10); $i++) {
                    $invoice = new Invoice;
                    $invoice->setAmount($faker->randomFloat(2, 10000, 75000))
                        ->setSentAt($faker->dateTimeBetween('-6 months'))
                        ->setStatus($faker->randomElement(["SENT", "PAID", "CANCELLED"]))
                        ->setCustomer($customer)
                        ->setChrono($chrono);

                    $chrono++;

                    $manager->persist($invoice);
                }
            }
        }


        $manager->flush();
    }
}
