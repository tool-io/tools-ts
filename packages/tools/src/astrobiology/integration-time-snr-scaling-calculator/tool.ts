import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly referenceSeconds: number;
  readonly referenceSnr: number;
  readonly targetSnr: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "referenceSeconds", label: "Reference seconds", kind: "number" },
  { id: "referenceSnr", label: "Reference snr", kind: "number" },
  { id: "targetSnr", label: "Target snr", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.referenceSeconds, "time");
  positive(i.referenceSnr, "reference");
  nonnegative(i.targetSnr, "target");
  return {
    conditionalSeconds:
      i.referenceSeconds * (i.targetSnr / i.referenceSnr) ** 2,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { referenceSeconds: 10, referenceSnr: 2, targetSnr: 4 },
  output: { result: { conditionalSeconds: 40 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/integration-time-snr-scaling-calculator",
  title: "Biosignature SNR Integration Time Scaling t∝(S/N)² Calculator",
  description:
    "Conditional SNR-squared integration scaling for independent stationary noise; no systematic floor or actual biosignature detection certainty.",
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
