import fetch from "node-fetch";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { gql } from "apollo-boost";
import * as fs from "fs";

const args = process.argv.slice(2);
console.log(args);
let topicTrigger = args
  .map(arg => arg.split("="))
  .filter(arg => arg[0] === "topic")
  .map(arg => arg[1])[0];
let schedule = args
  .map(arg => arg.split("="))
  .filter(arg => arg[0] === "schedule")
  .map(arg => arg[1])[0];
let name = args
  .map(arg => arg.split("="))
  .filter(arg => arg[0] === "name")
  .map(arg => arg[1])[0];

const client = new ApolloClient({
  link: createHttpLink({ uri: "http://localhost:5001/graphql", fetch }),
  cache: new InMemoryCache()
});

let ripple = {
  name,
  script: fs.readFileSync(args[0], "utf8"),
  topicTrigger,
  schedule
};
console.log(JSON.stringify(ripple, null, 2));

client.mutate({
  mutation: gql`
    mutation PushRipple($ripple: RippleInput!) {
      pushRipple(ripple: $ripple)
    }
  `,
  variables: {
    ripple
  }
});
