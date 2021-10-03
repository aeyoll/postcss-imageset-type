# PostCSS Imageset Type

[PostCSS](https://github.com/postcss/postcss) plugin for adding image-set type to background-images.

```css
.foo {
  background-image: url('img/logo.jpg');
}
```

```css
.foo {
  background-image: url('img/logo.jpg'); // Fallback for browser not supporting image-set
  background-image: image-set(
    'logo.avif' type('image/avif'),
    'logo.webp' type('image/webp'),
    'logo.jpg' type('image/jpeg')
  );
}
```

⚠ This plugin does **NOT** convert your images to avif or webp.

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-imageset-type
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js` in the project root, `"postcss"` section in `package.json` or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs] and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-imageset-type'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage


## Settings

| Option      | Default | Description                           |
| ----------- | ------- | ------------------------------------- |
| **useAvif** | true    | Include the avif version in image-set |
| **useWebp** | true    | Include the webp version in image-set |
