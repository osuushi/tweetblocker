// ==UserScript==
// @name         Tweet Blocker
// @namespace    http://osuushi.com/
// @version      0.2
// @description  Block specific tweets
// @author       Ada Cohen
// @match        https://twitter.com/*
// @run-at document-start
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

(function() {
  let blocked = GM_getValue("blockedTweets", {});

  const addToBlockList = (element) => {
    if (!confirm("Permanently hide this tweet (and any tweet that quotes it)?"))
      return;

    // Clean up any very old block ids
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const newBlocked = {};
    for (const [id, time] of Object.entries(blocked)) {
      if (time > oneYearAgo) newBlocked[id] = time;
    }
    blocked = newBlocked;

    // Add the new block id
    const blockId = makeBlockId(element);
    blocked[blockId] = Date.now();
    GM_setValue("blockedTweets", blocked);
    applyToAllArticles();
  };

  const userForElement = (element) => {
    return element.textContent.match(/@(\w+)/)[1];
  };

  const makeBlockId = (element) => {
    const timeEl = element.querySelector("time[datetime]");
    if (!timeEl) return null;
    const time = timeEl.dateTime;
    const user = userForElement(element);
    return `${user}::${time}`;
  };

  const addButtonsToArticle = (article) => {
    if (!makeBlockId(article)) return;
    if (article.querySelector(".tweet-blocker-button")) return;
    const likeButton = article.querySelector(
      "div[role=group] div[data-testid=like]"
    );
    if (!likeButton) return;
    const container = likeButton.parentElement.parentElement;
    const button = document.createElement("div");
    button.textContent = "🗑";
    button.onclick = (event) => {
      addToBlockList(article);
      event.stopPropagation();
    };
    button.classList.add("tweet-blocker-button");
    container.appendChild(button);

    // Check if there's a quote tweet button
    const blockquote = article.querySelector("div[role=blockquote]");
    if (blockquote) addButtonToQuoteTweet(blockquote);
  };

  const addButtonToQuoteTweet = (quote) => {
    const timeEl = quote.querySelector("time[datetime]");
    if (!timeEl) return;
    const button = document.createElement("div");
    button.textContent = "🗑";
    button.style.marginLeft = "18px";
    timeEl.parentElement.parentElement.parentElement.append(button);
    button.onclick = (event) => {
      addToBlockList(quote);
      event.stopPropagation();
    };
  };

  const applyToArticle = (article) => {
    addButtonsToArticle(article);
    if (blocked[makeBlockId(article)]) {
      article.remove();
      return;
    }
    // Check for a quote tweet
    const quote = article.querySelector("div[role=blockquote]");
    if (quote && blocked[makeBlockId(quote)]) article.remove();
  };

  const applyToAllArticles = () => {
    const articles = document.querySelectorAll("main article");
    for (const article of articles) {
      applyToArticle(article);
    }
  };

  let hasNewArticles = false;
  const observer = new MutationObserver((list) => {
    for (const record of list) {
      for (const node of record.addedNodes) {
        // Try to find a new article
        let article;
        if (node.tagName === "ARTICLE") {
          article = node;
        } else if (node instanceof Element) {
          article = node.querySelector("article");
        }

        if (article) {
          // If we can remove this article immediately, do so
          applyToArticle(article);
          // If the article is still attached, it might not be fully rendered
          // yet, so let the loop pick it up.
          if (article.isConnected) {
            hasNewArticles = true;
          }
        }
      }
    }
  });

  observer.observe(document.body, { subtree: true, childList: true });

  const loop = () => {
    if (hasNewArticles) {
      applyToAllArticles();
      hasNewArticles = false;
    }
    requestAnimationFrame(loop);
  };
  loop();
})();
