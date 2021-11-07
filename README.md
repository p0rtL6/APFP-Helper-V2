# APFP Helper - APFP bot v2
## Server Setup (case sensitive)
### Roles
* Full auth over approval and denial - `APFP Auth`
* Blocked from making requests - `APFP Blacklist`
### Channels
* The bot will only accept requests in this channel - `background-requests`
## Commands
* Base command - `/pfp`
* First & Second argument (required) - `links`
  * This argument is the link to the images that will be shown on your profile
  * Links must be a valid image from one of the following providers:
    1. Imgur - `i.imgur.com`
    2. Unsplash - `images.unsplash.com`
    3. Discord - `cdn.discordapp.com` or `media.discordapp.net`
## Developer Utils
### `src/utils`
* Register bot commands with Discord - `build-commands.js` (Sys)
### `src/handlers`
* Manual database interaction - `Database.js` (Sys, User)
  * Arguments are input based on the format of `valid interaction (input position)`
  * The arguments for calling this manually are as follows:
    * The type of interaction - e.g. `--create` or `-c` (all types follow CRUD) - all (1)
    * The selector value for the interaction - `string` - read & delete (2), update (3)
    * The selector "key" (if not set defaults to uid) - `string` - read & delete (3), update (4)
    * The params for a user - `{uid: 'string', img: 'string', orientation: 'string'}` - create & update (2)
## Deployment
1. Copy `docker-compose.yml` and fill in the env variables
2. Run with docker-compose