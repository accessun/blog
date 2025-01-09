# Accessun's Blog Project

Personal Github blog website project.

Features:

- ✅ Minimal styling
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

```text
├── README.md
├── astro.config.mjs
├── example
│   └── main_page_example.html
├── package-lock.json
├── package.json
├── public
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── author.jpg
│   ├── blog-placeholder-1.jpg
│   ├── blog-placeholder-2.jpg
│   ├── blog-placeholder-3.jpg
│   ├── blog-placeholder-4.jpg
│   ├── blog-placeholder-5.jpg
│   ├── blog-placeholder-about.jpg
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon-html_snippet.txt
│   ├── favicon.ico
│   ├── fonts
│   │   ├── atkinson-bold.woff
│   │   └── atkinson-regular.woff
│   └── site.webmanifest
├── src
│   ├── assets
│   │   └── icons
│   │       ├── github-mark.svg
│   │       └── x-logo.svg
│   ├── components
│   │   ├── BlogPostEntry.astro
│   │   ├── CategoryLabel.astro
│   │   ├── Footer.astro
│   │   ├── FormattedDate.astro
│   │   ├── GoogleAnalytics.astro
│   │   ├── Header.astro
│   │   └── SEO.astro
│   ├── consts.ts
│   ├── content
│   │   └── blog
│   │       ├── first-post.md
│   │       ├── markdown-style-guide.md
│   │       ├── second-post.md
│   │       ├── third-post.md
│   │       └── using-mdx.mdx
│   ├── content.config.ts
│   ├── layouts
│   │   ├── BaseLayout.astro
│   │   └── BlogPostLayout.astro
│   ├── pages
│   │   ├── 404.astro
│   │   ├── about.astro
│   │   ├── blog
│   │   │   └── [...slug].astro
│   │   ├── index.astro
│   │   └── rss.xml.js
│   ├── styles
│   ├── types.ts
│   └── utils.ts
├── tailwind.config.mjs
└── tsconfig.json
```
