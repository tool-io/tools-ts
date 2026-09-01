import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedGdcCurtainCenterSeparationsM: readonly number[];
  readonly observedLeftCurtainHalfWidthsM: readonly number[];
  readonly observedRightCurtainHalfWidthsM: readonly number[];
  readonly callerMinimumClearCurtainGapM: number;
}>;
export type Output = Readonly<{
  readonly observedGdcClearCurtainGapsM: readonly number[];
  readonly stationsBelowCallerClearCurtainGap: readonly number[];
}>;
const inputFields = [
  {
    id: "observedGdcCurtainCenterSeparationsM",
    label: "Observed gdc curtain center separations m",
    kind: "numberList",
  },
  {
    id: "observedLeftCurtainHalfWidthsM",
    label: "Observed left curtain half widths m",
    kind: "numberList",
  },
  {
    id: "observedRightCurtainHalfWidthsM",
    label: "Observed right curtain half widths m",
    kind: "numberList",
  },
  {
    id: "callerMinimumClearCurtainGapM",
    label: "Caller minimum clear curtain gap m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedGdcCurtainCenterSeparationsM.forEach((v) =>
    nonnegative(v, "observedGdcCurtainCenterSeparationsM"),
  );
  input.observedLeftCurtainHalfWidthsM.forEach((v) =>
    nonnegative(v, "observedLeftCurtainHalfWidthsM"),
  );
  input.observedRightCurtainHalfWidthsM.forEach((v) =>
    nonnegative(v, "observedRightCurtainHalfWidthsM"),
  );
  nonnegative(
    input.callerMinimumClearCurtainGapM,
    "callerMinimumClearCurtainGapM",
  );
  aligned(
    input.observedGdcCurtainCenterSeparationsM,
    input.observedLeftCurtainHalfWidthsM,
    "observedGdcCurtainCenterSeparationsM",
  );
  aligned(
    input.observedGdcCurtainCenterSeparationsM,
    input.observedRightCurtainHalfWidthsM,
    "observedGdcCurtainCenterSeparationsM",
  );
  const gaps = input.observedGdcCurtainCenterSeparationsM.map(
    (v, i) =>
      v -
      input.observedLeftCurtainHalfWidthsM[i] -
      input.observedRightCurtainHalfWidthsM[i],
  );
  return {
    observedGdcClearCurtainGapsM: gaps,
    stationsBelowCallerClearCurtainGap: gaps.flatMap((v, i) =>
      v < input.callerMinimumClearCurtainGapM ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGdcCurtainCenterSeparationsM: [2, 1.5],
  observedLeftCurtainHalfWidthsM: [0.5, 0.6],
  observedRightCurtainHalfWidthsM: [0.5, 0.6],
  callerMinimumClearCurtainGapM: 0.5,
} satisfies Input;
export const exampleOutput = {
  observedGdcClearCurtainGapsM: [1, 0.3],
  stationsBelowCallerClearCurtainGap: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/gdc-curtain-spacing-lookup",
  title: "GDC Curtain Spacing Lookup",
  description:
    "Audit actual GDC center spacing against independently measured asymmetric curtain thicknesses, retaining negative overlap; not symmetric Lyre lean projection or universal canopy architecture.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedGdcClearCurtainGapsM",
      label: "Observed gdc clear curtain gaps m",
      kind: "numberList",
    },
    {
      id: "stationsBelowCallerClearCurtainGap",
      label: "Stations below caller clear curtain gap",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGdcCurtainCenterSeparationsM:
        value.observedGdcCurtainCenterSeparationsM as readonly number[],
      observedLeftCurtainHalfWidthsM:
        value.observedLeftCurtainHalfWidthsM as readonly number[],
      observedRightCurtainHalfWidthsM:
        value.observedRightCurtainHalfWidthsM as readonly number[],
      callerMinimumClearCurtainGapM:
        value.callerMinimumClearCurtainGapM as number,
    }),
});
export const run = tool.execute;
export default tool;
