import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean
} from 'graphql';

import {MongoClient} from "mongodb";
let db;

MongoClient.connect(process.env.MONGO_URL, (err, database) => {
  if (err) throw err;

  db = database;
})

let linkType = new GraphQLObjectType({
  name: 'Link',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    title: {
      type: GraphQLString,
      args: {
        upcase: { type: GraphQLBoolean }
      },
      resolve: (obj, {upcase}) => upcase ? obj.title.toUpperCase() : obj.title
     },
    url: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.url.startsWith("http") ? obj.url : `http://${obj.url}`
      }
    },
    safe: {
      type: GraphQLBoolean,
      resolve: obj => obj.url.startsWith("https")
    }
  })
});


let counter = 0;

let schema = new GraphQLSchema({
  // top level fields
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      counter: {
        type: GraphQLInt,
        resolve: () => counter
      },

      square: {
        type: GraphQLInt,
        args: {
          num: { type: GraphQLInt }
        },
        resolve: (_, {num}) => num * num
      },

      links: {
        type: new GraphQLList(linkType),
        args: {
          first: { type: new GraphQLNonNull(GraphQLInt) }
        },
        resolve: (_, {first}) => db.collection("links").find({}).limit(first).toArray()
      },

      allLinks: {
        type: new GraphQLList(linkType),
        resolve: () => db.collection("links").find({}).toArray()
      },
    })
  }),

  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      incrementCounter: {
        type: GraphQLInt,
        args: {
          delta: {type: GraphQLInt}
        },
        resolve: (_, {delta}) => {
          counter = counter + delta;
          return counter;
        }
      },
      createLink: {
        type: linkType,
        args: {
          title: {type: GraphQLString},
          url: {type: GraphQLString},
        },
        resolve: (_, {title, url}) => {
          let newLink = {title, url, id: Date.now()};
          links.push(newLink);
          return newLink;
        }
      }
    })
  })
});

export default schema;
