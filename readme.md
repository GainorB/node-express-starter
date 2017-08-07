# Node Express Starter App

A boilerplate application used to scale applications faster. Using various node modules to build a solid foundation for any application. Which include user authentication, authorization, mailing, flash messages, OAuth, Mocha testing suite, PostgreSQL, MongoDB and more.


### DOCUMENTATION
1. pg-promise: https://github.com/vitaly-t/pg-promise
2. body-parser: https://github.com/expressjs/body-parser
3. cors: https://github.com/expressjs/cors

### DOWNLOAD PROJECT & INSTALL
1. Git clone this project
2. Open up Terminal or Command line
3. Navigate to the directory where the project was cloned to
4. Run this command: psql -f ./config/db/schema.sql
5. This command will create a PostgreSQL database along with the tables
6. Setup environment variables:
    * Create .env file in your project root with this variable
```
DATABASE_URL=postgres://localhost:5432/node_express_starter_app
```
7. To run the application, you need to install the dependencies, run this command: npm install --save
8. To start the application, run this command: npm start
9. The application will run at: localhost:3000, if that port is already in use, run this command: PORT=1738 npm start
10. This command will start the server at: localhost:1738