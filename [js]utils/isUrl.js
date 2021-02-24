/**
 * Check is url
 * @param {String} url
 * @returns {Boolean}
 */
export const isUrl = (url) => {
  if (/<\/?[^>]*>/.test(url))
    return false;
  return /^(?:(https|http|ftp|rtsp|mms):)?(\/\/)?(\w+:{0,1}\w*@)?([^\?#:\/]+\.[a-z]+|\d+\.\d+\.\d+\.\d+)?(:[0-9]+)?((?:\.?\/)?([^\?#]*)?(\?[^#]+)?(#.+)?)?$/.test(url);
}