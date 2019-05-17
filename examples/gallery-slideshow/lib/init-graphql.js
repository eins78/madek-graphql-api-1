import { GraphQLClient } from "graphql-hooks";
import memCache from "graphql-hooks-memcache";
import unfetch from "isomorphic-unfetch";

let graphQLClient = null;

function create(initialState = {}) {
  return new GraphQLClient({
    ssrMode: !process.browser,
    url: "http://localhost:4321/graphql",
    cache: memCache({ initialState }),
    fetch: process.browser ? fetch.bind() : unfetch
  });
}

export default function initGraphQL(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!graphQLClient) {
    graphQLClient = create(initialState);
  }

  return graphQLClient;
}
