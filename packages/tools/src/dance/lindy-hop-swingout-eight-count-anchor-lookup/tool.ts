import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly structure: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "structure", label: "Structure", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.structure,
      {
        "common-eight-count":
          "Common swingout rhythm: step-step, triple-step, step-step, triple-step over eight counts; stretch/rotation and footwork vary.",
      },
      "structure",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { structure: "common-eight-count" },
  output: {
    result: {
      reference:
        "Common swingout rhythm: step-step, triple-step, step-step, triple-step over eight counts; stretch/rotation and footwork vary.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/lindy-hop-swingout-eight-count-anchor-lookup",
  title: "Lindy Hop Swingout Eight Count Anchor Lookup",
  description:
    "Bounded swingout rhythm note; West Coast anchor terminology is not automatically imposed on Lindy Hop.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
