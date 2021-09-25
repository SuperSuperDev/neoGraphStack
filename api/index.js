import { Neo4jGraphQL } from "@neo4j/graphql";
//const { Neo4jGraphQL } = require("@neo4j/graphql");
import { neo4j } from "neo4j-driver";
//const neo4j = require("neo4j-driver");
import { gql, ApolloServer } from "apollo-server";
//const { ApolloServer } = require("apollo-server");

const typeDefs = gql`
    type Movie {
        title: String
        year: Int
        imdbRating: Float
        genres: [Genre] @relationship(type: "IN_GENRE", direction: OUT)
    }

    type Genre {
        name: String
        movies: [Movie] @relationship(type: "IN_GENRE", direction: IN)
    }
`;

const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic("neo4j", "letmein")
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

const server = new ApolloServer({
    schema: neoSchema.schema,
    context: ({ req }) => ({ req }),
});

server.listen(4000).then(() => console.log("Online"));