import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly preStormLiveCrownVolumesM3: readonly number[];
  readonly retainedLiveCrownVolumesM3: readonly number[];
  readonly callerMaximumLossFraction: number;
}>;
export type Output = Readonly<{
  readonly perTreeCrownLossFractions: readonly number[];
  readonly pooledRetainedCrownPercent: number;
  readonly aboveCallerLossFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "preStormLiveCrownVolumesM3",
    label: "Pre storm live crown volumes m3",
    kind: "numberList",
  },
  {
    id: "retainedLiveCrownVolumesM3",
    label: "Retained live crown volumes m3",
    kind: "numberList",
  },
  {
    id: "callerMaximumLossFraction",
    label: "Caller maximum loss fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.preStormLiveCrownVolumesM3.forEach((v) =>
    positive(v, "preStormLiveCrownVolumesM3"),
  );
  input.retainedLiveCrownVolumesM3.forEach((v) =>
    nonnegative(v, "retainedLiveCrownVolumesM3"),
  );
  fraction(input.callerMaximumLossFraction, "callerMaximumLossFraction");
  aligned(
    input.preStormLiveCrownVolumesM3,
    input.retainedLiveCrownVolumesM3,
    "preStormLiveCrownVolumesM3",
  );
  const perTreeCrownLossFractions = input.preStormLiveCrownVolumesM3.map(
    (v, i) =>
      1 -
      fraction(
        input.retainedLiveCrownVolumesM3[i] / v,
        "retainedLiveCrownVolumesM3",
      ),
  );
  return {
    perTreeCrownLossFractions,
    pooledRetainedCrownPercent:
      (100 * input.retainedLiveCrownVolumesM3.reduce((a, b) => a + b, 0)) /
      input.preStormLiveCrownVolumesM3.reduce((a, b) => a + b, 0),
    aboveCallerLossFlags: perTreeCrownLossFractions.map((v) =>
      v > input.callerMaximumLossFraction ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  preStormLiveCrownVolumesM3: [10, 20],
  retainedLiveCrownVolumesM3: [8, 10],
  callerMaximumLossFraction: 0.3,
} satisfies Input;
export const exampleOutput = {
  perTreeCrownLossFractions: [0.2, 0.5],
  pooledRetainedCrownPercent: 60,
  aboveCallerLossFlags: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/ice-storm-damage-severity-canopy-retained-percent",
  title: "Ice Storm Canopy Retained Severity Percent",
  description:
    "Audit measured retained live crown volume after storm against matched prestorm inventory and caller loss cutoff; canopy volume differs from shade/cover and observations do not establish future tree survival.",
  inputs: inputFields,
  outputs: [
    {
      id: "perTreeCrownLossFractions",
      label: "Per tree crown loss fractions",
      kind: "numberList",
    },
    {
      id: "pooledRetainedCrownPercent",
      label: "Pooled retained crown percent",
      kind: "number",
    },
    {
      id: "aboveCallerLossFlags",
      label: "Above caller loss flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      preStormLiveCrownVolumesM3:
        value.preStormLiveCrownVolumesM3 as readonly number[],
      retainedLiveCrownVolumesM3:
        value.retainedLiveCrownVolumesM3 as readonly number[],
      callerMaximumLossFraction: value.callerMaximumLossFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
