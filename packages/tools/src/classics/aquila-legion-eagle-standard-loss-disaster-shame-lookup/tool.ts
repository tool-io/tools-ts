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
          "The aquila represented the Roman legions eagle standard and its loss/recovery carried military/political significance.",
        reference: "Roman military literary and iconographic scholarship.",
        limitations:
          "Not every standard was an aquila or every account of shame a uniform documented response.",
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
      text: "The aquila represented the Roman legions eagle standard and its loss/recovery carried military/political significance.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/aquila-legion-eagle-standard-loss-disaster-shame-lookup",
  title: "Aquila Legion Eagle Standard Loss Disaster Shame Lookup",
  description:
    "Bounded offline reference: The aquila represented the Roman legions eagle standard and its loss/recovery carried military/political significance. Source: Roman military literary and iconographic scholarship. Not every standard was an aquila or every account of shame a uniform documented response. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
