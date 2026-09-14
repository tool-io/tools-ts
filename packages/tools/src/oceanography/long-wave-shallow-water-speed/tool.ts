import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly depthM: number;
  readonly gravityMPerS2: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "depthM", label: "Depth m", kind: "number" },
  { id: "gravityMPerS2", label: "Gravity m per s2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.depthM, "depth");
  positive(i.gravityMPerS2, "gravity");
  return { speedMPerS: Math.sqrt(i.gravityMPerS2 * i.depthM) };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { depthM: 4, gravityMPerS2: 9 },
  output: { result: { speedMPerS: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/long-wave-shallow-water-speed",
  title: "Long Wave Shallow Water Speed Calculator",
  description:
    "Linear shallow-water non-dispersive gravity wave speed sqrt(gh); caller must establish long-wave regime.",
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
