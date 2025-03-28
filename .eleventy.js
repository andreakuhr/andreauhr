const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");

const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");

  eleventyConfig.addCollection("posts", (collection) => {
    return collection.getFilteredByTag("post").sort((a, b) => {
      return b.date - a.date; // Sort by date (most recent first)
    });
  });

  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
  });

  // markdown for excerpt
  eleventyConfig.addFilter("md", function (content = "") {
    return markdownIt({ html: true }).render(content);
  });

  eleventyConfig.addFilter("slug", (str) => {
    if (!str) {
      return;
    }

    return slugify(str, {
      lower: true,
      strict: true,
      remove: /['"“”‘’@*()%$#:.,!?+=]/g,
    });
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  return {
    // When a passthrough file is modified, rebuild the pages:
    passthroughFileCopy: true,
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};
