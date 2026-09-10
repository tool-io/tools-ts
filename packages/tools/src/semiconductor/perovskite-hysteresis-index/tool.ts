import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualReverseScanEfficiency: number;
  readonly matchedForwardScanEfficiency: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualReverseScanEfficiency",
    label: "Actual reverse scan efficiency",
    kind: "number",
  },
  {
    id: "matchedForwardScanEfficiency",
    label: "Matched forward scan efficiency",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualReverseScanEfficiency, "reverse");
  nonnegative(input.matchedForwardScanEfficiency, "forward");
  return {
    signedReverseNormalizedHysteresisIndex:
      (input.actualReverseScanEfficiency - input.matchedForwardScanEfficiency) /
      input.actualReverseScanEfficiency,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualReverseScanEfficiency: 0.2,
    matchedForwardScanEfficiency: 0.15,
  },
  output: { result: { signedReverseNormalizedHysteresisIndex: 0.25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/perovskite-hysteresis-index",
  title: "Semiconductor Perovskite Hysteresis Index Calculator",
  description:
    "Declared perovskite scan-efficiency hysteresis (reverse\u2212forward)/reverse. Scan direction, rate, preconditioning and time history must be independently matched; signed metric not a universal hysteresis definition or physical ion-migration proof.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
