import "graphql-import-node";
import { buildSchema } from "type-graphql";
import { MessageResolver } from "./domain/message";
import { RippleResolver } from "./domain/ripple";

const schema = buildSchema({
  resolvers: [MessageResolver, RippleResolver]
});
export default schema;
