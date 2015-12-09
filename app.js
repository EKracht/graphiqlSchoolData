import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import routes from './routes/index';

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// mount a graphql endpoint
// needs a schema

import schema from "./data/schema";
import GraphQLHTTP from "express-graphql";

app.use("/graphql", GraphQLHTTP({
  schema,
  graphiql: true
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;


// # query ($limit: Int!) {
// #   links(first: $limit) {
// #     ...linkInfo
// #   }
// #   allLinks {
// #     ...linkInfo
// #   }
// # }

// # fragment linkInfo on Link {
// #     upcaseTitle: title(upcase: true),
// #     origTitle: title(upcase: false),
// #     url
// # }

// # mutation {
// #   createLink(title: "New Link2", url: "http://new.link2.com") {
// #     title
// #     url
// #     safe
// #   }
// # }

// query {
//   allLinks {
//     title
//   }
// }
