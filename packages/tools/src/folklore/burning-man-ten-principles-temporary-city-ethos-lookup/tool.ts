import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: [
      "summary",
      "reference",
      "limitations",
      "radicalInclusion",
      "gifting",
      "decommodification",
      "radicalSelfReliance",
      "radicalSelfExpression",
      "communalEffort",
      "civicResponsibility",
      "leavingNoTrace",
      "participation",
      "immediacy",
    ],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        radicalInclusion:
          "Radical Inclusion:welcome people without prerequisites for belonging in the stated community ethos.",
        gifting:
          "Gifting:give without requiring reciprocal exchange or a transaction.",
        decommodification:
          "Decommodification:resist commercial substitution for participatory experience.",
        radicalSelfReliance:
          "Radical Self-reliance:develop and rely on personal resources within the event context.",
        radicalSelfExpression:
          "Radical Self-expression:offer personally grounded expression while respecting recipients rights.",
        communalEffort:
          "Communal Effort:cooperate through shared projects and social networks.",
        civicResponsibility:
          "Civic Responsibility:take responsibility for public welfare and applicable laws.",
        leavingNoTrace:
          "Leaving No Trace:take responsibility for the environmental consequences and cleanup of activities.",
        participation:
          "Participation:actively contribute rather than treat the experience solely as spectatorship.",
        immediacy:
          "Immediacy:seek direct experience beyond habitual barriers and representations.",
        summary:
          "Burning Man's 2004 principles describe an event/community ethos rather than universal legal permissions.",
        reference: "Burning Man, The Ten Principles.",
        limitations:
          "Policies and implementations can change; verify current event rules separately.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "summary" },
  output: {
    result: {
      text: "Burning Man's 2004 principles describe an event/community ethos rather than universal legal permissions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/burning-man-ten-principles-temporary-city-ethos-lookup",
  title: "Burning Man Ten Principles Temporary City Ethos Lookup",
  description:
    "Bounded offline reference: Burning Man's 2004 principles describe an event/community ethos rather than universal legal permissions. Source: Burning Man, The Ten Principles. Policies and implementations can change; verify current event rules separately. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
