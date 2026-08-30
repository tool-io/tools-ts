import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  maximum,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedRutDepthsCm: readonly number[];
  readonly representedTrailLengthsM: readonly number[];
  readonly callerMaximumRutDepthCm: number;
}>;
export type Output = Readonly<{
  readonly maximumObservedRutDepthCm: number;
  readonly aboveCallerLimitFlags: readonly number[];
  readonly representedTrailLengthAboveLimitFraction: number;
}>;
const inputFields = [
  {
    id: "observedRutDepthsCm",
    label: "Observed rut depths cm",
    kind: "numberList",
  },
  {
    id: "representedTrailLengthsM",
    label: "Represented trail lengths m",
    kind: "numberList",
  },
  {
    id: "callerMaximumRutDepthCm",
    label: "Caller maximum rut depth cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedTrailLengthsM.forEach((v) =>
    positive(v, "representedTrailLengthsM"),
  );
  input.observedRutDepthsCm.forEach((v) =>
    nonnegative(v, "observedRutDepthsCm"),
  );
  nonnegative(input.callerMaximumRutDepthCm, "callerMaximumRutDepthCm");
  aligned(
    input.observedRutDepthsCm,
    input.representedTrailLengthsM,
    "observedRutDepthsCm",
  );
  const aboveCallerLimitFlags = input.observedRutDepthsCm.map((v) =>
    v > input.callerMaximumRutDepthCm ? 1 : 0,
  );
  return {
    maximumObservedRutDepthCm: maximum(input.observedRutDepthsCm),
    aboveCallerLimitFlags,
    representedTrailLengthAboveLimitFraction:
      aboveCallerLimitFlags.reduce<number>(
        (s, v, i) => s + v * input.representedTrailLengthsM[i],
        0,
      ) / input.representedTrailLengthsM.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRutDepthsCm: [2, 5, 10],
  representedTrailLengthsM: [1, 2, 1],
  callerMaximumRutDepthCm: 5,
} satisfies Input;
export const exampleOutput = {
  maximumObservedRutDepthCm: 10,
  aboveCallerLimitFlags: [0, 0, 1],
  representedTrailLengthAboveLimitFraction: 0.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/rut-depth-maximum-operational-limit-checker",
  title: "Maximum Rut Depth Operational Limit Checker",
  description:
    "Audit measured rut-depth exceedances and represented trail-length fraction under caller operational limit; equality is allowed and no ecosystem/access safety or regulation is embedded.",
  inputs: inputFields,
  outputs: [
    {
      id: "maximumObservedRutDepthCm",
      label: "Maximum observed rut depth cm",
      kind: "number",
    },
    {
      id: "aboveCallerLimitFlags",
      label: "Above caller limit flags",
      kind: "numberList",
    },
    {
      id: "representedTrailLengthAboveLimitFraction",
      label: "Represented trail length above limit fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRutDepthsCm: value.observedRutDepthsCm as readonly number[],
      representedTrailLengthsM:
        value.representedTrailLengthsM as readonly number[],
      callerMaximumRutDepthCm: value.callerMaximumRutDepthCm as number,
    }),
});
export const run = tool.execute;
export default tool;
