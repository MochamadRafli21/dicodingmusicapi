{ pkgs ? import <nixpkgs> {} 
}:

pkgs.mkShell {
  name="scalev-dev-env";
  buildInputs = [
    pkgs.nodejs-14_x
    pkgs.git
  ];
  shellHook = ''
  echo "Setting up .env"
  rm .env
  touch .env
  echo "#Cache Service" >> .env
  echo "REDIS_SERVER=localhost" >> .env
  echo "#Message broker" >> .env
  echo "RABBITMQ_SERVER=amqp://localhost" >> .env
  echo "#JWT" >> .env
  echo "ACCESS_TOKEN_AGE=2000" >> .env
  echo "REFRESH_TOKEN_KEY=cb8c3534aaba5e69c5030da9fd596116633bd80fcf71c77ba165ad19b4d88adc57e3f406b70dda09033b454a816b95b08618d73844339cb0b7690d2d25795436" >> .env 
  echo "ACCESS_TOKEN_KEY=30aeec477728a37b5f3076bdc5eaba193991412c21e8ea04b37f91ee83d83c7091e4a5541eab19e432156044da74dd19980c395bc975cbda1a3a5d381838e5b9" >> .env
  echo "#Server" >> .env
  echo "HOST=localhost" >> .env
  echo "PORT=5000" >> .env
  echo "#postgresql" >> .env
  echo "PGUSER=postgres" >> .env
  echo "PGPASSWORD=root" >> .env
  echo "PGDATABASE=openmusic" >> .env
  echo "PGHOST=localhost" >> .env
  echo "PGPORT=5432" >> .env
  echo "Welcome to Open Music API 1"
  echo "Install Language server"
  echo "Start Developing"
  zsh
  '';
}
