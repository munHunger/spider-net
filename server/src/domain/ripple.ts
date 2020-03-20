import {
  ObjectType,
  InputType,
  Field,
  Mutation,
  Arg,
  PubSub,
  PubSubEngine
} from "type-graphql";
import { Message } from "./message";

let ripples: Ripple[] = [];

@ObjectType()
@InputType("RippleInput")
export class Ripple {
  @Field()
  name: string;
  @Field()
  script: string;
  @Field({ nullable: true })
  topicTrigger: string;
  subscriptionId: number;
}

export class RippleResolver {
  @Mutation(() => String)
  pushRipple(@Arg("ripple") ripple: Ripple, @PubSub() pubsub: PubSubEngine) {
    pubsub
      .subscribe(
        "NEW_MESSAGE",
        (message: Message) => {
          if (message.topic === ripple.topicTrigger) {
            console.log(eval(ripple.script));
            eval(ripple.script)(message);
          }
        },
        {}
      )
      .then(id => {
        ripple.subscriptionId = id;
        ripples.push(ripple);
      });
    return "OK";
  }
  @Mutation(() => Number)
  removeRipple(@Arg("name") ripple: string, @PubSub() pubsub: PubSubEngine) {
    let ids = ripples.filter(r => r.name === ripple).map(r => r.subscriptionId);
    ids.forEach(id => pubsub.unsubscribe(id));
    return ids.length;
  }
}
