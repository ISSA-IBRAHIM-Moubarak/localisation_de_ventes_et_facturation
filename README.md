# composer require "lexik/jwt-authentication-bundle"
Opennssl
mkdir -p config/jwt

###config
openssl genrsa -out config/jwt/private.pem -aes256 4096
openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem#   a p i - s t a 
 