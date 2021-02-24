export const appendScript = (url) => {
  var script = document.createElement("script");
  script.src = url;
  var n = document.getElementsByTagName("script")[0];
  n.parentNode.insertBefore(script, n);
}