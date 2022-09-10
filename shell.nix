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
