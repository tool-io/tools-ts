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
          "Saint-Gaudens double-eagle production involved 1907 high-relief designs and modifications for mass circulation.",
        reference: "US Mint, Saint-Gaudens coin histories.",
        limitations:
          "Ultra/high/low-relief distinctions and later commemorative products require issue-specific attribution.",
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
      text: "Saint-Gaudens double-eagle production involved 1907 high-relief designs and modifications for mass circulation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/saint-gaudens-double-eagle-high-relief-history-lookup",
  title: "Saint Gaudens Double Eagle High Relief History Lookup",
  description:
    "Bounded offline reference: Saint-Gaudens double-eagle production involved 1907 high-relief designs and modifications for mass circulation. Source: US Mint, Saint-Gaudens coin histories. Ultra/high/low-relief distinctions and later commemorative products require issue-specific attribution. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
