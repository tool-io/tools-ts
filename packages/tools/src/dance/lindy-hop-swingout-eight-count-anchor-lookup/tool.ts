import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly structure: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "structure", label: "Structure", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
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
export const calculate = (i: Input) => {
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

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reference: { type: "string" } },
        required: ["reference"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
