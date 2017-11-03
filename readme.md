## Usage

### Basic
* Simple Iframe approach to allow payments in web applications
* You can create your own separate fields or you can combine in one field
* ccn 
  * exp 
  * cvc *** pending
  * zip
  * pay *** pending


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

## File Structure



     ├── sdk/                       
     │  
     ├── ui/                         



