import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  curve,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedMesfetGateV: readonly number[];
  readonly observedMatchedDrainAmps: readonly number[];
  readonly queryGateV: number;
}>;
export type Output = Readonly<{
  readonly interpolatedMesfetDrainAmps: number;
  readonly localMeasuredTransconductanceSiemens: number;
}>;
const inputFields = [
  {
    id: "observedMesfetGateV",
    label: "Observed mesfet gate v",
    kind: "numberList",
  },
  {
    id: "observedMatchedDrainAmps",
    label: "Observed matched drain amps",
    kind: "numberList",
  },
  { id: "queryGateV", label: "Query gate v", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedDrainAmps.forEach((v) =>
    nonnegative(v, "observedMatchedDrainAmps"),
  );
  const fit = curve(
    input.observedMesfetGateV,
    input.observedMatchedDrainAmps,
    input.queryGateV,
  );
  return {
    interpolatedMesfetDrainAmps: fit.value,
    localMeasuredTransconductanceSiemens: fit.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMesfetGateV: [0, 1, 2],
  observedMatchedDrainAmps: [1, 3, 7],
  queryGateV: 1.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedMesfetDrainAmps: 5,
  localMeasuredTransconductanceSiemens: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/mesfet-transconductance",
  title: "Semiconductor MESFET Transconductance Calculator",
  description:
    "Extract local MESFET measured dId/dVg and current within caller same-drain-bias trace, not a saturation transconductance parameter formula or extrapolation.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedMesfetDrainAmps",
      label: "Interpolated mesfet drain amps",
      kind: "number",
    },
    {
      id: "localMeasuredTransconductanceSiemens",
      label: "Local measured transconductance siemens",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMesfetGateV: value.observedMesfetGateV as readonly number[],
      observedMatchedDrainAmps:
        value.observedMatchedDrainAmps as readonly number[],
      queryGateV: value.queryGateV as number,
    }),
});
export const run = tool.execute;
export default tool;
