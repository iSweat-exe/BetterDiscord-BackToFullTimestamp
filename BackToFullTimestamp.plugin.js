/**
 * @name BackToFullTimestamp
 * @author isweatmc
 * @description Restores the full timestamp format on messages.
 * Example: "8:20 PM" → "Today at 8:20 PM".
 * @version 1.1.3
 * @invite inviteCode
 * @authorId 1138590489176707093
 * @website https://github.com/iSweat-exe
 * @source noRepository
 */

module.exports = class BackToFullTimestamp {
  start() {
    this.updateTimestamps();

    this.observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          this.updateTimestamps();
          break;
        }
      }
    });
    this.observer.observe(document.body, { childList: true, subtree: true });

    // if (BdApi.getData("BackToFullTimestamp", "showAlert") !== false) {
    //   BdApi.alert("BackToFullTimestamp v1.1.2", "BackToFullTimestamp is running.");
    // }
  }

  stop() {
    if (this.observer) this.observer.disconnect();
  }

  /** Updates all timestamps in the document. */
  updateTimestamps() {
    document.querySelectorAll("h3 time").forEach(timeElement => {
      const timestamp = timeElement.getAttribute("datetime");
      if (!timestamp) return;
      
      const date = new Date(timestamp);
      const formattedTime = this.formatTimestamp(date);
      
      if (formattedTime) {
        timeElement.textContent = formattedTime;
      }
    });
  }

  /**
   * Formats the timestamp into a more readable format.
   * @param {Date} date - The date object to format.
   * @returns {string|null} - Formatted timestamp or null if unchanged.
   */
  formatTimestamp(date) {
    const today = new Date();
    const lang = document.documentElement.lang || "en";
    
    if (lang === "fr") {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      if (this.isSameDay(date, today)) {
        return `Aujourd'hui à ${hours}:${minutes}`;
      } else if (this.isSameDay(date, new Date(today.setDate(today.getDate() - 1)))) {
        return `Hier à ${hours}:${minutes}`;
      }
    } else {
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      let period = "AM";
      
      if (hours >= 12) {
        period = "PM";
        if (hours > 12) hours -= 12;
      } else if (hours === 0) {
        hours = 12;
      }
      
      if (this.isSameDay(date, today)) {
        return `Today at ${hours}:${minutes} ${period}`;
      } else if (this.isSameDay(date, new Date(today.setDate(today.getDate() - 1)))) {
        return `Yesterday at ${hours}:${minutes} ${period}`;
      }
    }
    return null;
  }

  /**
   * Checks if two dates are on the same day.
   * @param {Date} date1 - First date to compare.
   * @param {Date} date2 - Second date to compare.
   * @returns {boolean} - True if both dates are the same day.
   */
  isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
};
