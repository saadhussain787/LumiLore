module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPassthroughCopy("frontend/*.webp");
  eleventyConfig.addPassthroughCopy("frontend/*.png");
  eleventyConfig.addPassthroughCopy("frontend/*.svg");
  eleventyConfig.addPassthroughCopy("frontend/*.css");
  eleventyConfig.addPassthroughCopy("frontend/assets");

  return {
    dir: {
      input: "frontend",
      includes: "_includes",
      output: "_site"
    }
  };
};
