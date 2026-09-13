import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  sum,
  mean,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualStationaryRepeatedPositionsMm: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualStationaryRepeatedPositionsMm",
    label: "Actual stationary repeated positions mm",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.actualStationaryRepeatedPositionsMm.length < 2 ||
    input.actualStationaryRepeatedPositionsMm.some((v) => v.length !== 3)
  )
    simpleError("positions", "Actual≥2repeated3Dstationarypositions.");
  const m = [0, 1, 2].map((j) =>
    mean(input.actualStationaryRepeatedPositionsMm.map((v) => v[j])),
  );
  return {
    observedRmsRepeatabilityAroundCentroidMm: Math.sqrt(
      mean(
        input.actualStationaryRepeatedPositionsMm.map((r) =>
          sum(r.map((v, j) => (v - m[j]) ** 2)),
        ),
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualStationaryRepeatedPositionsMm: [
      [0, 0, 0],
      [2, 0, 0],
    ],
  },
  output: { result: { observedRmsRepeatabilityAroundCentroidMm: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/tracking-precision-mm",
  title: "Tracking Precision mm Calculator",
  description:
    "Actual3Dstationarytrackingpopulation RMS scatter aroundcentroidmm, precision not ground truth accuracy; independent noise/drift/exposure assumption external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
