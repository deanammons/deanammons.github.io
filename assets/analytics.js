/* Optional GoatCounter integration. No tracking occurs with the supplied config.
 * Official APIs: https://www.goatcounter.com/help/js
 *               https://www.goatcounter.com/help/events
 */
(function () {
  "use strict";

  var config = window.DEAN_ANALYTICS;
  if (!config || config.enabled !== true || window.__deanAnalyticsLoaded) return;

  // Restrict collection to the published website. File and local previews stay private.
  if (window.location.protocol !== "https:") return;
  var allowedHosts = Array.isArray(config.allowedHosts) ? config.allowedHosts : [];
  if (allowedHosts.indexOf(window.location.hostname.toLowerCase()) === -1) return;

  // This site's preference guard is additional to the provider's own filtering.
  var doNotTrack = [navigator.doNotTrack, navigator.msDoNotTrack, window.doNotTrack];
  if (navigator.globalPrivacyControl === true || doNotTrack.some(function (value) {
    return String(value).toLowerCase() === "1" || String(value).toLowerCase() === "yes";
  })) return;

  var endpoint;
  try {
    endpoint = new URL(config.endpoint);
  } catch (error) {
    return;
  }
  if (endpoint.protocol !== "https:" ||
      !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.goatcounter\.com$/.test(endpoint.hostname) ||
      endpoint.pathname !== "/count" || endpoint.search || endpoint.hash ||
      endpoint.username || endpoint.password || endpoint.port) return;

  // Avoid double collection if an owner has already added the provider elsewhere.
  if (document.querySelector("script[data-goatcounter]")) return;
  window.__deanAnalyticsLoaded = true;

  window.goatcounter = {
    // Count directory/index.html and directory/ as the same page; omit query strings.
    path: function () {
      return window.location.pathname.replace(/\/index\.html$/, "/");
    },
    // Store the external referring origin only, without its path or query string.
    referrer: function () {
      if (!document.referrer) return "";
      try {
        var referrer = new URL(document.referrer);
        if (!/^https?:$/.test(referrer.protocol) || referrer.origin === window.location.origin) return "";
        return referrer.origin;
      } catch (error) {
        return "";
      }
    }
  };

  // Native GoatCounter page counting and data-goatcounter-click events run after load.
  // A network error leaves the website usable; there is no synthetic fallback count.
  var script = document.createElement("script");
  script.async = true;
  script.src = "https://gc.zgo.at/count.js";
  script.referrerPolicy = "no-referrer";
  script.setAttribute("data-goatcounter", endpoint.href);
  document.head.appendChild(script);
}());
