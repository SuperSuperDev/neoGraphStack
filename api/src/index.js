const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer, gql } = require("apollo-server");
const neo4j = require("neo4j-driver");

const typeDefs = gql`
  type Site {
    title: String!
    url: String!
    description: String!
    pages: [Page] @relationship(type: "HAS_PAGE", direction: OUT)
  }

  type Page {
    title: String
    content: String
    site: [Site] @relationship(type: "HAS_PAGE", direction: IN)
  }
`;

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "letmein"),
  { encrypted: false }
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

const server = new ApolloServer({
  
  schema: neoSchema.schema,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});