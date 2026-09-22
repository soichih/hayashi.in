#!/bin/bash
# Download one image for the kiosk news agent, shrink it to a kiosk-sized (480px wide)
# JPEG, and print the path to use in news.yml (e.g. img/fall-folk-festival.jpg).
#
#   kiosk-news-image.sh <image-url> <short-name>
#
# This is the agent's only way to write binary files, so it is deliberately
# narrow: http(s) only, output only into $KIOSK_NEWS_STAGE/img, and ffmpeg
# reads the download as a still image from stdin so a hostile file (e.g. an
# HLS playlist disguised as an image) can't make it open anything else.

set -euo pipefail

url="${1:-}"
name="${2:-}"
stage="${KIOSK_NEWS_STAGE:-}"

die() { echo "error: $*" >&2; exit 1; }

[[ -n "$stage" && -d "$stage" ]] || die "KIOSK_NEWS_STAGE is not set to an existing directory"
[[ "$url" =~ ^https?:// ]] || die "url must start with http:// or https://"

name=$(echo "$name" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-' | sed 's/^-*//; s/-*$//' | cut -c1-60)
[[ -n "$name" ]] || die "give a short name made of letters and digits"

mkdir -p "$stage/img"
out="$name.jpg"
n=2
while [[ -e "$stage/img/$out" ]]; do out="$name-$n.jpg"; n=$((n + 1)); done

tmp=$(mktemp "$stage/.download.XXXXXX")
trap 'rm -f "$tmp"' EXIT

curl -fsSL --proto '=http,https' --proto-redir '=http,https' \
	--max-time 30 --max-filesize 20000000 \
	-A "Mozilla/5.0 (X11; Linux x86_64) kiosk-news" \
	-o "$tmp" "$url" || die "download failed"

ffmpeg -nostdin -loglevel error -y -f image2pipe -i pipe:0 -frames:v 1 \
	-vf "scale='min(480,iw)':-2" -q:v 4 "$stage/img/$out" < "$tmp" \
	|| { rm -f "$stage/img/$out"; die "not a usable image"; }

[[ -s "$stage/img/$out" ]] || { rm -f "$stage/img/$out"; die "conversion produced no output"; }
echo "img/$out"
