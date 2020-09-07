# Tweetblocker

Hide specific tweets, and any tweets that quote them.

## Installation

1. Install the Tampermonkey extension for your browser, by going [here](https://www.tampermonkey.net/).

2. Click [here](https://raw.githubusercontent.com/osuushi/tweetblocker/master/tweetblocker.tamper.js) to install Tweetblocker.

3. Click the "Install" button as shown below:

![Install page](https://raw.githubusercontent.com/osuushi/tweetblocker/master/install.png)

## Usage

Every tweet will get a 🗑 button at the bottom, like this:

![Install page](https://raw.githubusercontent.com/osuushi/tweetblocker/master/example.png)

Click on that to hide that tweet. Any tweet that quotes it will also be hidden.

If a tweet is quoted, then the quoted tweet will get its own 🗑

![Install page](https://raw.githubusercontent.com/osuushi/tweetblocker/master/examplequote.png)

Clicking that button will hide the _quoted_ tweet (and any other tweet that quotes it).

## Limitations:

-   Blocked tweets will hide from your timeline and from threads etc., but you'll still see them if you visit them directly.

-   The block expires after a year (from when you blocked it). This is just to keep the block list from growing forever. It's unusual for a tweet to continue being quoted and retweeted for longer than a year, so this should very rarely matter.

-   Twitter can change their design at any moment, and the nature of scripts like this is that they often break when that happens. What will likely happen in this case is that tweets will stop being hidden, and the 🗑 buttons will stop showing up. I'll hopefully be able to fix it (and it should autoupdate) if that happens, but these scripts are always at the mercy of the site's original code.
