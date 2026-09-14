import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly periodSeconds: number;
  readonly gravityMPerS2: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "periodSeconds", label: "Period seconds", kind: "number" },
  { id: "gravityMPerS2", label: "Gravity m per s2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.periodSeconds, "period");
  positive(i.gravityMPerS2, "gravity");
  return {
    phaseSpeedMPerS: (i.gravityMPerS2 * i.periodSeconds) / (2 * Math.PI),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { periodSeconds: 2, gravityMPerS2: 3.141592653589793 },
  output: { result: { phaseSpeedMPerS: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/deepwater-wave-phase-speed",
  title: "Deepwater Wave Phase Speed Calculator",
  description:
    "Linear deepwater gravity-wave phase speed gT/(2pi); finite-depth and capillary effects omitted.",
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
