import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Bona vacantia concerns ownerless/vacant property under particular legal frameworks, including later traditions.",
        reference: "Roman legal texts and legal-history scholarship.",
        limitations:
          "Finding an apparently abandoned object does not grant ownership; modern jurisdiction and cultural-property laws differ.",
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
      text: "Bona vacantia concerns ownerless/vacant property under particular legal frameworks, including later traditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/bona-vacantia-ownerless-property-claim-lookup",
  title: "Bona Vacantia Ownerless Property Claim Lookup",
  description:
    "Bounded offline reference: Bona vacantia concerns ownerless/vacant property under particular legal frameworks, including later traditions. Source: Roman legal texts and legal-history scholarship. Finding an apparently abandoned object does not grant ownership; modern jurisdiction and cultural-property laws differ. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
