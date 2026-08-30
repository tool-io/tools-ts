import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly measuredShootLengthsM: readonly number[];
  readonly shootInclinationsFromVerticalDegrees: readonly number[];
  readonly shootBaseHeightsM: readonly number[];
  readonly callerAvailableCanopyTopHeightM: number;
}>;
export type Output = Readonly<{
  readonly projectedShootTopHeightsM: readonly number[];
  readonly aboveCallerCanopyTopFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "measuredShootLengthsM",
    label: "Measured shoot lengths m",
    kind: "numberList",
  },
  {
    id: "shootInclinationsFromVerticalDegrees",
    label: "Shoot inclinations from vertical degrees",
    kind: "numberList",
  },
  {
    id: "shootBaseHeightsM",
    label: "Shoot base heights m",
    kind: "numberList",
  },
  {
    id: "callerAvailableCanopyTopHeightM",
    label: "Caller available canopy top height m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredShootLengthsM.forEach((v) =>
    nonnegative(v, "measuredShootLengthsM"),
  );
  aligned(
    input.measuredShootLengthsM,
    input.shootInclinationsFromVerticalDegrees,
    "measuredShootLengthsM",
  );
  aligned(
    input.measuredShootLengthsM,
    input.shootBaseHeightsM,
    "measuredShootLengthsM",
  );
  if (input.shootInclinationsFromVerticalDegrees.some((v) => Math.abs(v) > 90))
    simpleError(
      "inclinations",
      "Upright shoot inclinations within [-90,90] required.",
    );
  const projectedShootTopHeightsM = input.measuredShootLengthsM.map(
    (l, i) =>
      input.shootBaseHeightsM[i] +
      l *
        Math.cos(
          (input.shootInclinationsFromVerticalDegrees[i] * Math.PI) / 180,
        ),
  );
  return {
    projectedShootTopHeightsM,
    aboveCallerCanopyTopFlags: projectedShootTopHeightsM.map((v) =>
      v > input.callerAvailableCanopyTopHeightM ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredShootLengthsM: [1, 2],
  shootInclinationsFromVerticalDegrees: [0, 60],
  shootBaseHeightsM: [0.5, 0.5],
  callerAvailableCanopyTopHeightM: 1.4,
} satisfies Input;
export const exampleOutput = {
  projectedShootTopHeightsM: [1.5, 1.5],
  aboveCallerCanopyTopFlags: [1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/canopy-height-shoot-length-checker",
  title: "Canopy Height Shoot Length Checker",
  description:
    "Project measured upright shoot lengths/inclinations from actual basal heights against caller canopy envelope, not raw length-only comparison or a hedging recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "projectedShootTopHeightsM",
      label: "Projected shoot top heights m",
      kind: "numberList",
    },
    {
      id: "aboveCallerCanopyTopFlags",
      label: "Above caller canopy top flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredShootLengthsM: value.measuredShootLengthsM as readonly number[],
      shootInclinationsFromVerticalDegrees:
        value.shootInclinationsFromVerticalDegrees as readonly number[],
      shootBaseHeightsM: value.shootBaseHeightsM as readonly number[],
      callerAvailableCanopyTopHeightM:
        value.callerAvailableCanopyTopHeightM as number,
    }),
});
export const run = tool.execute;
export default tool;
