## Usage

### Basic
* Best practices in file and application organization for Angular 2.
* Using Bootstrap as framwork ui template, you can override it with your own theme.
* Ready to go build system
* Hot Module Replacement with Webpack and [@angularclass/hmr](https://github.com/angularclass/angular2-hmr) and [@angularclass/hmr-loader](https://github.com/angularclass/angular2-hmr-loader)


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

<br>
## File Structure
Using the module approach in App. This is the new standard for developing Angular apps and a great way
to ensure maintainable code by encapsulation of our behavior logic. A module is basically a self contained
app usually in a single file or a folder with each concern as a file: style, template, specs, e2e, and component class.
 Here's how it looks:


     ├── sdk/                       
     │  
     ├── ui/                         



