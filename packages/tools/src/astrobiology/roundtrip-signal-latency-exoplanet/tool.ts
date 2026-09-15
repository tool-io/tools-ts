import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch52-shared.js";
export type Input = Readonly<{ readonly distanceLightyears: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "distanceLightyears", label: "Distance lightyears", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.distanceLightyears, "distance");
  return { idealRoundTripYears: 2 * i.distanceLightyears };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { distanceLightyears: 10 },
  output: { result: { idealRoundTripYears: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/roundtrip-signal-latency-exoplanet",
  title: "Round-Trip Signal Latency to Exoplanet Calculator",
  description:
    "Ideal two-way vacuum signal latency in years, no processing wait or planet/star motion.",
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
