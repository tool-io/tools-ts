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
          "US Civil-War tokens include patriotic types and store cards issued amid small-change shortages.",
        reference: "Civil War Token Society catalogues.",
        limitations:
          "Copper appearance or patriotic imagery does not establish date, issuer or authenticity.",
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
      text: "US Civil-War tokens include patriotic types and store cards issued amid small-change shortages.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/civil-war-tokens-store-card-patriotic-copper-lookup",
  title: "Civil War Tokens Store Card Patriotic Copper Lookup",
  description:
    "Bounded offline reference: US Civil-War tokens include patriotic types and store cards issued amid small-change shortages. Source: Civil War Token Society catalogues. Copper appearance or patriotic imagery does not establish date, issuer or authenticity. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
