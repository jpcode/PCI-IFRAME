## Usage

### Quick start
**Make sure you have Node version >= 5.0 and NPM >= 3**

```bash

# install http-sever
npm install http-server -g

# start UI
http-server -p 99 ( or any port that you prefer )

# start SDK(epay) 
http-server -p 70 ( currently port 70 is used to ilustrate demo )

# start SDK server
node sdk/server/api.js

```
go to [http://0.0.0.0:99](http://0.0.0.0:99) or [http://localhost:99](http://localhost:99) in your browser

### Basic
* Simple Iframe approach to allow payments in web applications
* You can create your own separate fields or you can combine in one field
  * ccn 
  * exp 
  * zip
  * cvc *** pending
  * pay *** pending one field UX


###

```javascript

(function(){

      var styleccn = {
        base : {
          "font-weight": 600,
          "font-family": 'Quicksand, Open Sans, Segoe UI, sans-serif',
          "font-size": '16px',
          "font-smoothing": 'antialiased',
          "border" : "0",
          "color" : "#fff"
        },
        invalid : {

        }
      }

      var styleexp = {
        base : {
          "font-weight": 600,
          "font-family": 'Quicksand, Open Sans, Segoe UI, sans-serif',
          "font-size": '16px',
          "font-smoothing": 'antialiased',
          "width" : "70px",
          "border" : "0",
          "color" : "#fff"
        },
        invalid: {

        }
      }

      /*
         Default true , set validations false to get a server validations
       */

      Sdkpay.init("OsXtdOtYbs4ABltnhOLDgcoRJt1i6qEs",{
        validations : false
      });
      Sdkpay.createElement('ccn', '#example3-card-number', styleccn );
      Sdkpay.createElement('exp','#example3-card-expiry', styleexp );
      Sdkpay.createElement('zip', '#example3-card-zip', styleexp ); 
   })();

   function submitPaymentForm() {
    // make your own validations
    var validate = true;
    var options = {};
    var elemError = document.getElementById('error');
    var elemErrorMessage = document.getElementById('errorMessage');
    elemErrorMessage.innerHtml = '';
    var loader = document.getElementById("loader");
    loader.style.display = "block";
    Sdkpay.createToken( function( result ){
        loader.style.display = "none";
        console.log( result );
        if ( result.success ){
          document.getElementById("errorMessage").textContent= result.token;
        }
    });
   }

``` 

### Error Handler

<section>
  <table>
    <thead>
      <tr>
        <th>Decline Code</th>
        <th>Description</th>
        <th>Next Steps</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>approve_with_id</code></td>
        <td>The payment cannot be authorized.</td>
        <td>The payment should be attempted again. If it still cannot be processed, the customer needs to contact their bank.</td>
      </tr>
      <tr>
        <td><code>call_issuer</code></td>
        <td>The card has been declined for an unknown reason.</td>
        <td>The customer needs to contact their bank for more information.</td>
      </tr>
      <tr>
        <td><code>card_not_supported</code></td>
        <td>The card does not support this type of purchase.</td>
        <td>The customer needs to contact their bank to make sure their card can be used to make this type of purchase.</td>
      </tr>
      <tr>
        <td><code>card_velocity_exceeded</code></td>
        <td>The customer has exceeded the balance or credit limit available on their card.</td>
        <td>The customer should contact their bank for more information.</td>
      </tr>
      <tr>
        <td><code>currency_not_supported</code></td>
        <td>The card does not support the specified currency.</td>
        <td>The customer needs check with the issuer that the card can be used for the type of currency specified.</td>
      </tr>
      <tr>
        <td><code>do_not_honor</code></td>
        <td>The card has been declined for an unknown reason.</td>
        <td>The customer needs to contact their bank for more information.</td>
      </tr>
      <tr>
        <td><code>do_not_try_again</code></td>
        <td>The card has been declined for an unknown reason.</td>
        <td>The customer should contact their bank for more information.</td>
      </tr>
        <tr><td><code>duplicate_transaction</code></td>
        <td>A transaction with identical amount and credit card information was submitted very recently.</td>
        <td>Check to see if a recent payment already exists.</td>
      </tr>
      <tr>
        <td><code>expired_card</code></td>
        <td>The card has expired.</td>
        <td>The customer should use another card.</td>
      </tr>
      <tr>
        <td><code>fraudulent</code></td>
        <td>The payment has been declined as Stripe suspects it is fraudulent.</td>
        <td>Do not report more detailed information to your customer.  Instead, present as you would the <code>generic_decline</code> described below.</td>
      </tr>
      <tr>
        <td><code>generic_decline</code></td>
        <td>The card has been declined for an unknown reason.</td>
        <td>The customer needs to contact their bank for more information.</td>
      </tr>
      <tr>
        <td><code>incorrect_number</code></td>
        <td>The card number is incorrect.</td>
        <td>The customer should try again using the correct card number.</td>
      </tr>
      <tr>
        <td><code>incorrect_cvc</code></td>
        <td>The CVC number is incorrect.</td>
        <td>The customer should try again using the correct CVC.</td>
      </tr>
      <tr>
        <td><code>incorrect_pin</code></td>
        <td>The PIN entered is incorrect. This decline code only applies to payments made with a card reader. </td>
        <td>The customer should try again using the correct PIN.</td>
      </tr>
      <tr>
        <td><code>incorrect_zip</code></td>
        <td>The ZIP/postal code is incorrect.</td>
        <td>The customer should try again using the correct billing ZIP/postal code.</td>
      </tr>
      <tr>
        <td><code>insufficient_funds</code></td>
        <td>The card has insufficient funds to complete the purchase.</td>
        <td>The customer should use an alternative payment method.</td>
      </tr>
      <tr>
        <td><code>invalid_account</code></td>
        <td>The card, or account the card is connected to, is invalid.</td>
        <td>The customer needs to contact their bank to check that the card is working correctly.</td>
      </tr>
      <tr>
        <td><code>invalid_amount</code></td>
        <td>The payment amount is invalid, or exceeds the amount that is allowed.</td>
        <td>If the amount appears to be correct, the customer needs to check with their bank that they can make purchases of that amount.</td>
      </tr>
      <tr>
        <td><code>invalid_cvc</code></td>
        <td>The CVC number is incorrect.</td>
        <td>The customer should try again using the correct CVC.</td>
      </tr>
      <tr>
        <td><code>invalid_expiry_year</code></td>
        <td>The expiration year invalid.</td>
        <td>The customer should try again using the correct expiration date.</td>
      </tr>
      <tr>
        <td><code>invalid_number</code></td>
        <td>The card number is incorrect.</td>
        <td>The customer should try again using the correct card number.</td>
      </tr>
      <tr>
        <td><code>invalid_pin</code></td>
        <td>The PIN entered is incorrect. This decline code only applies to payments made with a card reader.</td>
        <td>The customer should try again using the correct PIN.</td>
      </tr>
      <tr>
        <td><code>issuer_not_available</code></td>
        <td>The card issuer could not be reached, so the payment could not be authorized.</td>
        <td>The payment should be attempted again. If it still cannot be processed, the customer needs to contact their bank.</td>
      </tr>
      <tr>
        <td><code>lost_card</code></td>
        <td>The payment has been declined because the card is reported lost.</td>
        <td>The specific reason for the decline should not be reported to the customer. Instead, it needs to be presented as a generic decline.</td>
      </tr>
      <tr>
        <td><code>new_account_information_available</code></td>
        <td>The card, or account the card is connected to, is invalid.</td>
        <td>The customer needs to contact their bank for more information.</td>
      </tr>
      <tr>
        <td><code>no_action_taken</code></td>
        <td>The card has been declined for an unknown reason.</td>
        <td>The customer should contact their bank for more information.</td>
      </tr>
      <tr>
        <td><code>not_permitted</code></td>
        <td>The payment is not permitted.</td>
        <td>The customer needs to contact their bank for more information.</td>
      </tr>
      <tr>
        <td><code>pickup_card</code></td>
        <td>The card cannot be used to make this payment (it is possible it has been reported lost or stolen).</td>
        <td>The customer needs to contact their bank for more information.</td>
      </tr>
      <tr>
        <td><code>pin_try_exceeded</code></td>
        <td>The allowable number of PIN tries has been exceeded.</td>
        <td>The customer must use another card or method of payment.</td>
      </tr>
      <tr>
        <td><code>processing_error</code></td>
        <td>An error occurred while processing the card.</td>
        <td>The payment should be attempted again. If it still cannot be processed, try again later.</td>
      </tr>
      <tr>
        <td><code>reenter_transaction</code></td>
        <td>The payment could not be processed by the issuer for an unknown reason.</td>
        <td>The payment should be attempted again. If it still cannot be processed, the customer needs to contact their bank.</td>
      </tr>
      <tr>
        <td><code>restricted_card</code></td>
        <td>The card cannot be used to make this payment (it is possible it has been reported lost or stolen).</td>
        <td>The customer needs to contact their bank for more information.</td>
      </tr>
      <tr>
        <td><code>revocation_of_all_authorizations</code></td>
        <td>The card has been declined for an unknown reason.</td>
        <td>The customer should contact their bank for more information.</td>
      </tr>
      <tr>
        <td><code>revocation_of_authorization</code></td>
        <td>The card has been declined for an unknown reason.</td>
        <td>The customer should contact their bank for more information.</td>
      </tr>
      <tr>
        <td><code>security_violation</code></td>
        <td>The card has been declined for an unknown reason.</td>
        <td>The customer needs to contact their bank for more information.</td>
      </tr>
      <tr>
        <td><code>service_not_allowed</code></td>
        <td>The card has been declined for an unknown reason.</td>
        <td>The customer should contact their bank for more information.</td>
      </tr>
      <tr>
        <td><code>stolen_card</code></td>
        <td>The payment has been declined because the card is reported stolen.</td>
        <td>The specific reason for the decline should not be reported to the customer. Instead, it needs to be presented as a generic decline.</td>
      </tr>
      <tr>
        <td><code>stop_payment_order</code></td>
        <td>The card has been declined for an unknown reason.</td>
        <td>The customer should contact their bank for more information.</td>
      </tr>
      <tr>
        <td><code>testmode_decline</code></td>
        <td>A Stripe test card number was used.</td>
        <td>A genuine card must be used to make a payment.</td>
      </tr>
      <tr>
        <td><code>transaction_not_allowed</code></td>
        <td>The card has been declined for an unknown reason.</td>
        <td>The customer needs to contact their bank for more information.</td>
      </tr>
      <tr>
        <td><code>try_again_later</code></td>
        <td>The card has been declined for an unknown reason.</td>
        <td>Ask the customer to attempt the payment again. If subsequent payments are declined, the customer should contact their bank for more information.</td>
      </tr>
      <tr>
        <td><code>withdrawal_count_limit_exceeded</code></td>
        <td>The customer has exceeded the balance or credit limit available on their card. </td>
        <td>The customer should use an alternative payment method.</td>
      </tr>
    </tbody>
  </table>


</section>

## File Structure



     ├── sdk/                       
     │  
     ├── ui/                         



