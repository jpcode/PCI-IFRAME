const VALIDATOR =  {
    "AMERICAN_EXPRESS" : {
        cls : 'american-express',
        digits : [15],
        test: function( ccn ){
            var dig = ccn[0] + ccn[1];
            return dig === '34' || dig === '37';
        }
    },
    "VISA" : {
        cls : 'visa',
        digits :[13,16],
        test: function( ccn ){
            return ccn[0] === '4';
        }
    },
    "DISCOVER": {
        cls : 'discover',
        digits: [16],
        test: function( ccn ){
          var tdig = ccn[0] + ccn[1];
          var fdig = tdig + ccn[2] + ccn[3];
          return tdig === '64' || tdig === '65' || fdig === '6011';
        }
    },
    "MASTERCARD" : {
        cls : 'mastercard',
        digits: [16],
        test : function( ccn ){
          var tdig = ~~(ccn[0] + ccn[1]);
          var fdig = ~~(tdig + ccn[2] + ccn[3]);
          return ( tdig >= 51 && tdig <= 55 ) || ( fdig >= 2221 && fdig <= 2720 );
          
        }
    }
};

var utils = (function(){
   return {
        luhn_algorithm : function(){

        },
        major_industry_information : function(){
          
        },
        ajax : function(){

        },
        messenger : function(){

        }
   }
})();




