import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly cuspReliefRatios: readonly number[];
  readonly cuspAnglesDegrees: readonly number[];
  readonly callerLowReliefMaximum: number;
  readonly callerBluntAngleMinimumDegrees: number;
}>;
export type Output = Readonly<{
  readonly lowReliefBluntCuspProxyFlags: readonly number[];
  readonly discordantCuspProxyFlags: readonly number[];
}>;
const inputFields = [
  { id: "cuspReliefRatios", label: "Cusp relief ratios", kind: "numberList" },
  { id: "cuspAnglesDegrees", label: "Cusp angles degrees", kind: "numberList" },
  {
    id: "callerLowReliefMaximum",
    label: "Caller low relief maximum",
    kind: "number",
  },
  {
    id: "callerBluntAngleMinimumDegrees",
    label: "Caller blunt angle minimum degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.cuspReliefRatios.forEach((v) => nonnegative(v, "cuspReliefRatios"));
  nonnegative(input.callerLowReliefMaximum, "callerLowReliefMaximum");
  aligned(input.cuspReliefRatios, input.cuspAnglesDegrees, "cuspReliefRatios");
  if (
    input.cuspAnglesDegrees.some((v) => v <= 0 || v >= 180) ||
    input.callerBluntAngleMinimumDegrees <= 0 ||
    input.callerBluntAngleMinimumDegrees >= 180
  )
    simpleError(
      "angles",
      "Cusp and cutoff angles strictly within (0,180) required.",
    );
  return {
    lowReliefBluntCuspProxyFlags: input.cuspReliefRatios.map((r, i) =>
      r <= input.callerLowReliefMaximum &&
      input.cuspAnglesDegrees[i] >= input.callerBluntAngleMinimumDegrees
        ? 1
        : 0,
    ),
    discordantCuspProxyFlags: input.cuspReliefRatios.map((r, i) =>
      r <= input.callerLowReliefMaximum !==
      input.cuspAnglesDegrees[i] >= input.callerBluntAngleMinimumDegrees
        ? 1
        : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cuspReliefRatios: [0.2, 0.8],
  cuspAnglesDegrees: [100, 40],
  callerLowReliefMaximum: 0.3,
  callerBluntAngleMinimumDegrees: 90,
} satisfies Input;
export const exampleOutput = {
  lowReliefBluntCuspProxyFlags: [1, 0],
  discordantCuspProxyFlags: [0, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/mesowear-diet-classifier",
  title: "Mesowear Angle Diet Classifier",
  description:
    "Compare caller mesowear relief/angle morphology criteria, preserving discordance rather than labeling actual diet; calibration, wear stage and taxonomic applicability remain external.",
  inputs: inputFields,
  outputs: [
    {
      id: "lowReliefBluntCuspProxyFlags",
      label: "Low relief blunt cusp proxy flags",
      kind: "numberList",
    },
    {
      id: "discordantCuspProxyFlags",
      label: "Discordant cusp proxy flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      cuspReliefRatios: value.cuspReliefRatios as readonly number[],
      cuspAnglesDegrees: value.cuspAnglesDegrees as readonly number[],
      callerLowReliefMaximum: value.callerLowReliefMaximum as number,
      callerBluntAngleMinimumDegrees:
        value.callerBluntAngleMinimumDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
