import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, angle } from "../batch53-shared.js";

export type Input = Readonly<{ ph: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "ph", label: "Ph", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  angle(i.ph, "pH", 0, 14);
  return {
    below44: i.ph < 4.4,
    atOrAbove62: i.ph >= 6.2,
    interpretation:
      i.ph < 4.4
        ? "positive-screen"
        : i.ph >= 6.2
          ? "negative-screen"
          : "intermediate",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { ph: 4 },
  output: {
    result: {
      below44: true,
      atOrAbove62: false,
      interpretation: "positive-screen",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/methylred-ph-threshold-checker",
  title: "Methyl Red pH Below 4.4 Positive Threshold Checker",
  description:
    "Apply the methyl-red educational pH boundaries below 4.4 and at least 6.2; the intermediate region is retained, not forced positive or negative.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          below44: { type: "boolean" },
          atOrAbove62: { type: "boolean" },
          interpretation: { type: "string" },
        },
        required: ["below44", "atOrAbove62", "interpretation"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
