const fs = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {
  // Copy only static image/icon assets from public/ (excludes preview.html & duplicate verification HTML)
  eleventyConfig.addPassthroughCopy({ "public/arfa-profile.jpg": "public/arfa-profile.jpg" });
  eleventyConfig.addPassthroughCopy({ "public/saad-profile.jpg": "public/saad-profile.jpg" });
  eleventyConfig.addPassthroughCopy({ "public/logo-render.png": "public/logo-render.png" });
  eleventyConfig.addPassthroughCopy({ "public/logo.svg": "public/logo.svg" });
  eleventyConfig.addPassthroughCopy({ "public/logo.webp": "public/logo.webp" });
  eleventyConfig.addPassthroughCopy({ "public/favicon.png": "public/favicon.png" });
  eleventyConfig.addPassthroughCopy({ "public/favicon.svg": "public/favicon.svg" });
  eleventyConfig.addPassthroughCopy({ "public/og-preview.png": "public/og-preview.png" });
  eleventyConfig.addPassthroughCopy({ "public/og-preview.jpg": "public/og-preview.jpg" });
  eleventyConfig.addPassthroughCopy("frontend/*.webp");
  eleventyConfig.addPassthroughCopy("frontend/*.svg");
  eleventyConfig.addPassthroughCopy("frontend/*.css");
  eleventyConfig.addPassthroughCopy("frontend/assets");

  // Explicit root mapping for favicons, social previews, and metadata
  eleventyConfig.addPassthroughCopy({ "public/favicon.png": "favicon.png" });
  eleventyConfig.addPassthroughCopy({ "public/og-preview.png": "og-preview.png" });
  eleventyConfig.addPassthroughCopy({ "public/og-preview.jpg": "og-preview.jpg" });

  // Hook to ensure dist/ root also receives og-preview assets
  eleventyConfig.on('eleventy.after', async () => {
    const distDir = path.resolve(__dirname, 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    const publicPreview = path.resolve(__dirname, 'public', 'og-preview.png');
    const distPreview = path.resolve(distDir, 'og-preview.png');
    if (fs.existsSync(publicPreview)) {
      fs.copyFileSync(publicPreview, distPreview);
    }
    const publicPreviewJpg = path.resolve(__dirname, 'public', 'og-preview.jpg');
    const distPreviewJpg = path.resolve(distDir, 'og-preview.jpg');
    if (fs.existsSync(publicPreviewJpg)) {
      fs.copyFileSync(publicPreviewJpg, distPreviewJpg);
    }
  });

  return {
    dir: {
      input: "frontend",
      includes: "_includes",
      output: "_site"
    }
  };
};
