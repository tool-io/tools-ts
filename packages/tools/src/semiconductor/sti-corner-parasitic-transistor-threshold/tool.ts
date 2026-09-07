import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedPlanarThresholdV: readonly number[];
  readonly observedStiCornerThresholdV: readonly number[];
  readonly callerMaximumCornerThresholdDropV: number;
}>;
export type Output = Readonly<{
  readonly signedStiCornerMinusPlanarThresholdV: readonly number[];
  readonly cornerThresholdDropReviewIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPlanarThresholdV",
    label: "Observed planar threshold v",
    kind: "numberList",
  },
  {
    id: "observedStiCornerThresholdV",
    label: "Observed sti corner threshold v",
    kind: "numberList",
  },
  {
    id: "callerMaximumCornerThresholdDropV",
    label: "Caller maximum corner threshold drop v",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerMaximumCornerThresholdDropV,
    "callerMaximumCornerThresholdDropV",
  );
  aligned(
    input.observedPlanarThresholdV,
    input.observedStiCornerThresholdV,
    "observedPlanarThresholdV",
  );
  const shifts = input.observedStiCornerThresholdV.map(
    (v, i) => v - input.observedPlanarThresholdV[i],
  );
  return {
    signedStiCornerMinusPlanarThresholdV: shifts,
    cornerThresholdDropReviewIndices: shifts.flatMap((v, i) =>
      -v > input.callerMaximumCornerThresholdDropV ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPlanarThresholdV: [1, 2],
  observedStiCornerThresholdV: [0.8, 2.1],
  callerMaximumCornerThresholdDropV: 0.1,
} satisfies Input;
export const exampleOutput = {
  signedStiCornerMinusPlanarThresholdV: [-0.2, 0.1],
  cornerThresholdDropReviewIndices: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/sti-corner-parasitic-transistor-threshold",
  title: "Semiconductor Sti Corner Parasitic Transistor Threshold Calculator",
  description:
    "Audit actual matched corner/planar transistor thresholds and caller parasitic drop criterion, no generic narrow-width coefficient or inferred parasitic conduction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedStiCornerMinusPlanarThresholdV",
      label: "Signed sti corner minus planar threshold v",
      kind: "numberList",
    },
    {
      id: "cornerThresholdDropReviewIndices",
      label: "Corner threshold drop review indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPlanarThresholdV:
        value.observedPlanarThresholdV as readonly number[],
      observedStiCornerThresholdV:
        value.observedStiCornerThresholdV as readonly number[],
      callerMaximumCornerThresholdDropV:
        value.callerMaximumCornerThresholdDropV as number,
    }),
});
export const run = tool.execute;
export default tool;
