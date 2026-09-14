import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly reeledLengthMeters: number;
  readonly elapsedMinutes: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "reeledLengthMeters", label: "Reeled length meters", kind: "number" },
  { id: "elapsedMinutes", label: "Elapsed minutes", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.reeledLengthMeters, "length");
  positive(i.elapsedMinutes, "time");
  return { lineSpeedMetersPerMinute: i.reeledLengthMeters / i.elapsedMinutes };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { reeledLengthMeters: 1000, elapsedMinutes: 10 },
  output: { result: { lineSpeedMetersPerMinute: 100 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/multiend-reeling-speed-mpm",
  title: "Multiend Reeling Speed MPM Calculator",
  description:
    "Measured multiend filament takeup line speed, not aggregate throughput or motor RPM.",
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
