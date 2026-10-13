import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly signedRise: number;
  readonly horizontalRun: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "signedRise", label: "Signed rise", kind: "number" },
  { id: "horizontalRun", label: "Horizontal run", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  positive(i.horizontalRun, "run");
  return {
    gradientRatio:
      i.signedRise === 0
        ? "level"
        : (i.signedRise < 0 ? "down " : "up ") +
          "1 in " +
          String(i.horizontalRun / Math.abs(i.signedRise)),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { signedRise: 2, horizontalRun: 20 },
  output: { result: { gradientRatio: "up 1 in 10" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/gradient-ratio-formatter",
  title: "Gradient Ratio 1-in-N Formatter",
  description:
    "Format signed gradient as vertical 1-in-N; level handled explicitly, not slope compliance.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { gradientRatio: { type: "string" } },
        required: ["gradientRatio"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
