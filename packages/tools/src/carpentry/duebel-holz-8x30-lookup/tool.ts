import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch49-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        nominalDimensions:
          "Named8\u00d730mmwooddowel convention is nominal8mmdiameter,30mmlength; actual product tolerances must be verified.",
        limitations:
          "No drilling depth, fit, glueor joint capacity is inferred.",
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
  input: { topic: "nominalDimensions" },
  output: {
    result: {
      text: "Named8\u00d730mmwooddowel convention is nominal8mmdiameter,30mmlength; actual product tolerances must be verified.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/duebel-holz-8x30-lookup",
  title: "Holz D\u00fcbel 8x30 Lookup",
  description:
    "Bounded off line reference: Named milestone dimensional/condition reference only, not fabricated universal material rule. Explicit topics nominalDimensions, limitations. No full/live authority, clinical diagnosis, safe-use approval or universal individual outcome.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
