const {
  ApolloServer,
  gql
} = require('apollo-server');
const dayjs = require('dayjs');
const {
  GraphQLScalarType
} = require('graphql');
const {
  Kind
} = require('graphql/language');


const typeDefs = gql `
  scalar MyDate
  type Query {
    tomorrow(date: MyDate!): MyDate!
    yesterday(date: MyDate!): MyDate!
  }
`;

const resolvers = {
  Query: {
    tomorrow: (_, {
      date
    }) => {
      return date.add(1, "day");
    },
    yesterday: (_, {
      date
    }) => {
      return date.subtract(1, "day");
    }
  },
  MyDate: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return dayjs(value); // value from the client
    },
    serialize(value) {
      return dayjs(value).format("DD-MM-YYYY");; // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return dayjs(ast.value) // ast value is always in string format
      }
      return null;
    },
  }),
};
const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({
  url
}) => {
  console.log(`Server running at ${url}`);
})