function utils(){
  var ajax = {};

  ajax.x = function () {
      var xhr;

      if (window.XMLHttpRequest) {

          xhr = new XMLHttpRequest();
      } else {

          xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
      return xhr;
  };

  ajax.send = function (url, callback, method, data, async) {
      if (async === undefined) {
          async = true;
      }
      var x = ajax.x();
      x.open(method, url, async);
      x.onreadystatechange = function () {
          if (x.readyState == 4) {
              callback(x.responseText)
          }
      };
      if (method == 'POST') {
          x.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      }
      x.send(data)
  };

  ajax.get = function (url, data, callback, async) {
      var query = [];
      for (var key in data) {
          query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
      }
      ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
  };

  ajax.post = function (url, data, callback, async) {
      ajax.send(url, callback, 'POST', data, async)
  };

  
  return {
    ajax : ajax
  };
}

var Helper = new utils();
