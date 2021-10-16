const replaceExt = require('replace-ext');

function getImagePath(value) {
  if (value.indexOf('data:') > -1) {
    return false;
  }

  const reg = /(?:\(['"]?)(.*?)(?:['"]?\))/;
  const cleanPath = reg.exec(value);

  return cleanPath[1];
}

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

function localReplaceExt(value, ext) {
  let newValue;

  if (isValidHttpUrl(value)) {
    const url = new URL(value);
    url.pathname = replaceExt(url.pathname, ext);
    newValue = url;
  } else {
    newValue = replaceExt(value, ext);
  }

  return newValue;
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
        if (imagePath === false) {
          return;
        }

        let imageSet = [];

        if (useAvif) {
          imageSet.push(`'${localReplaceExt(imagePath, '.avif')}' type('image/avif')`);
        }

        if (useWebp) {
          imageSet.push(`'${localReplaceExt(imagePath, '.webp')}' type('image/webp')`);
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
