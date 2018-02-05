/* 
You can register from your client directly, just need to allow setOrigin from UI client and use 
in this script instead of get the parent url programatically 
https://www.nczonline.net/blog/2013/04/16/getting-the-url-of-an-iframes-parent/
*/

function getParentUrl() {
    var isInIframe = (parent !== window),
        parentUrl = null;

    if (isInIframe) {
        parentUrl = document.referrer;
    }
    return parentUrl;
}

function SdkConfig(){
  var api = 'http://localhost:5000/'
  var config = {
    origin: getParentUrl(),
    api : {
       token : api + 'token'
    }
  }
  return {
    config : config
  };
}

var SDKConfig = new SdkConfig();