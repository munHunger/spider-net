import fetch from "node-fetch";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { gql } from "apollo-boost";

export default class SpiderClient {
  private client: ApolloClient<any>;
  constructor() {
    this.client = new ApolloClient({
      link: createHttpLink({
        uri: "http://localhost:5001/graphql",
        fetch: fetch as any
      }),
      cache: new InMemoryCache()
    });
  }
  pushMessage(topic: string, message: any) {
    this.client.mutate({
      mutation: gql`
        mutation PushMessage($message: MessageInput!) {
          pushMessage(message: $message)
        }
      `,
      variables: {
        message: {
          topic,
          message: JSON.stringify(message)
        }
      }
    });
  }
}
