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
const CronJob = require("cron").CronJob;

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
  @Field({ nullable: true })
  schedule: string;

  subscriptionId: number;
  jobSchedule: any;
}

export class RippleResolver {
  @Mutation(() => String)
  pushRipple(@Arg("ripple") ripple: Ripple, @PubSub() pubsub: PubSubEngine) {
    this.removeRipple(ripple.name, pubsub);
    if (ripple.topicTrigger) {
      pubsub
        .subscribe(
          "NEW_MESSAGE",
          (message: Message) => {
            if (message.topic === ripple.topicTrigger) {
              eval(ripple.script)(message);
            }
          },
          {}
        )
        .then(id => {
          ripple.subscriptionId = id;
        });
    }
    if (ripple.schedule) {
      ripple.jobSchedule = new CronJob(
        ripple.schedule,
        () => {
          eval(ripple.script)();
        },
        null,
        true,
        "Europe/Stockholm"
      );
      ripple.jobSchedule.start();
    }
    ripples.push(ripple);
    return "OK";
  }
  @Mutation(() => Number)
  removeRipple(@Arg("name") ripple: string, @PubSub() pubsub: PubSubEngine) {
    let ids = ripples.filter(r => r.name === ripple).map(r => r.subscriptionId);
    ids.forEach(id => pubsub.unsubscribe(id));
    return ids.length;
  }
}
