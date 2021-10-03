const replaceExt = require('replace-ext');

function getImagePath(value) {
  const reg = /(?:\(['"]?)(.*?)(?:['"]?\))/;
  const cleanPath = reg.exec(value);

  return cleanPath[1];
}

module.exports = (opts = { }) => {
  const useAvif = opts && typeof opts.useAvif !== 'undefined' ? opts.useAvif : true;
  const useWebp = opts && typeof opts.useWebp !== 'undefined' ? opts.useWebp : true;

  return {
    postcssPlugin: 'imageset-type',

    Declaration: {
      'background-image': (decl) => {
        if (decl.value.includes('image-set')) {
          return;
        }

        const imagePath = getImagePath(decl.value);

        let imageSet = [];

        if (useAvif) {
          imageSet.push(`'${replaceExt(imagePath, '.avif')}' type('image/avif')`);
        }

        if (useWebp) {
          imageSet.push(`'${replaceExt(imagePath, '.webp')}' type('image/webp')`);
        }

        if (useAvif || useWebp) {
          imageSet.push(`'${imagePath}' type('image/jpeg')`);

          decl.after({
            prop: 'background-image',
            value: `image-set(${imageSet.join(',')})`,
          });
        }
      }
    }
  }
}
module.exports.postcss = true
