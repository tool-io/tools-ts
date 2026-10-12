import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly method: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "method", label: "Method", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return {
    reference: pick(
      i.method,
      {
        spread:
          "Use actual plated sample volume when computing CFU/mL; no universal 0.1mL volume is assumed.",
        pour: "Use actual inoculated sample volume when computing CFU/mL; molten-agar volume is not the original sample volume.",
      },
      "method",
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { method: "spread" },
  output: {
    result: {
      reference:
        "Use actual plated sample volume when computing CFU/mL; no universal 0.1mL volume is assumed.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/spread-vs-pour-volume-note-generator",
  title: "Spread Plate versus Pour Plate Correction Volume Note Generator",
  description:
    "Bounded culture-plating volume distinction, no correction for viability, colony recovery or safe culturing protocol.",
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
