import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch52-shared.js";
export type Input = Readonly<{ readonly eccentricity: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "eccentricity", label: "Eccentricity", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.eccentricity, "e");
  return {
    conicClass:
      i.eccentricity < 1
        ? "elliptic"
        : i.eccentricity === 1
          ? "parabolic"
          : "hyperbolic",
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { eccentricity: 1 },
  output: { result: { conicClass: "parabolic" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/parabolic-boundary-flag-checker",
  title: "Parabolic Trajectory Boundary e=1 Flag Checker",
  description:
    "Exact numerical eccentricity conic branch under two-body assumptions; no tolerance-based boundary or observational orbit confidence.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conicClass: { type: "string" } },
        required: ["conicClass"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
