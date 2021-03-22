# Navegadores

Instalar:

- Chrome Stable
- Chrome Dev
- Firefox
- Firefox Dev

# Editor de Texto

Esta WebStorm, Athom, VS Code, Sublime Text, Vim, etc, etc, etc.

Instalar:

- Visual Studio Code.

Con las siguiente extensiones:

- Prettier - Code formatter
- Color Highlight
- Live Server ?
- Path Intellisense ?
- Auto Rename Tag
- Material Icon Theme
- NPM support for vs code

# WSL

- Actualizar a la versión de windows 20H4

https://www.microsoft.com/es-es/software-download/windows10

- Habilitar Windows Subsystem for Linux

https://docs.microsoft.com/en-us/windows/wsl/install-win10

- Habilitar la característica Plataqforma de máquina virtual de Windows y qu e la virtualización esté habilitada en el BIOS.

- Instalar Ubuntu

- Si no se puede activar WSL 2 - Instalar Virtual Box o algún Hypervisor... podría ser HyperV

- Instalar la Terminal de la tienda de Windows

- Instalar Node JS en ubuntu

> node -v
>
> npm -v
>
> npx create-react-app MyReactApp

Y configurar una llave ssh para github con wsl

> ssh-keygen -t rsa -b 4096 -C "email de github"
>
> eval "$(ssh-agent -s)"
>
> cat /.ssh/id_rsa.pub
>
> git config --global user.email user@email.com
>
> git config --global user.name username
