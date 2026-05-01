#!/bin/bash

set -euo pipefail
IFS=$'\n\t'
sudo pacman -S virt-manager qemu-desktop libvirt dnsmasq edk2-ovmf

sudo systemctl enable --now libvirtd

sudo usermod -aG libvirt $(whoami)

sudo virsh net-start default && sudo virsh net-autostart default
