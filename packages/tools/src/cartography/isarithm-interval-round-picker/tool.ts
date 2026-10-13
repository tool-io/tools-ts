import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  niceInterval,
} from "../batch52-shared.js";
export type Input = Readonly<{ readonly rawInterval: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "rawInterval", label: "Raw interval", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  positive(i.rawInterval, "interval");
  return { roundedInterval: niceInterval(i.rawInterval) };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { rawInterval: 3 },
  output: { result: { roundedInterval: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/isarithm-interval-round-picker",
  title: "Isarithm Interval Round Number Picker",
  description:
    "Round a positive raw isarithm interval upward to 1/2/5 times a decade; no automatic scientifically suitable contour interval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { roundedInterval: { type: "number" } },
        required: ["roundedInterval"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
