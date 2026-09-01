import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  sum,
  points,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedPipeEndPressuresPa: readonly number[];
  readonly observedEffectiveEndAreasM2: readonly number[];
  readonly callerDirectedReactionUnitVectors: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly modeledPressureAnchorReactionVectorN: readonly number[];
  readonly modeledPressureAnchorResultantN: number;
}>;
const inputFields = [
  {
    id: "observedPipeEndPressuresPa",
    label: "Observed pipe end pressures pa",
    kind: "numberList",
  },
  {
    id: "observedEffectiveEndAreasM2",
    label: "Observed effective end areas m2",
    kind: "numberList",
  },
  {
    id: "callerDirectedReactionUnitVectors",
    label: "Caller directed reaction unit vectors",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPipeEndPressuresPa.forEach((v) =>
    nonnegative(v, "observedPipeEndPressuresPa"),
  );
  input.observedEffectiveEndAreasM2.forEach((v) =>
    nonnegative(v, "observedEffectiveEndAreasM2"),
  );
  aligned(
    input.observedPipeEndPressuresPa,
    input.observedEffectiveEndAreasM2,
    "observedPipeEndPressuresPa",
  );
  aligned(
    input.observedPipeEndPressuresPa,
    input.callerDirectedReactionUnitVectors,
    "observedPipeEndPressuresPa",
  );
  points(input.callerDirectedReactionUnitVectors);
  input.callerDirectedReactionUnitVectors.forEach((r) => {
    if (Math.abs(Math.hypot(...r) - 1) > 1e-8)
      simpleError(
        "vectors",
        "Explicit caller unit reaction directions required.",
      );
  });
  const vector = [0, 1].map((j) =>
    sum(
      input.observedPipeEndPressuresPa.map(
        (v, i) =>
          v *
          input.observedEffectiveEndAreasM2[i] *
          input.callerDirectedReactionUnitVectors[i][j],
      ),
    ),
  );
  return {
    modeledPressureAnchorReactionVectorN: vector,
    modeledPressureAnchorResultantN: Math.hypot(...vector),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPipeEndPressuresPa: [1000, 2000],
  observedEffectiveEndAreasM2: [0.01, 0.02],
  callerDirectedReactionUnitVectors: [
    [1, 0],
    [0, 1],
  ],
} satisfies Input;
export const exampleOutput = {
  modeledPressureAnchorReactionVectorN: [10, 40],
  modeledPressureAnchorResultantN: 41.23105625617661,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/anchor-force",
  title: "Plumbing Anchor Force Calculator",
  description:
    "Resolve actual independent end-pressure thrusts through caller local planar directed reactions; momentum/thermal/friction loads excluded, no geodesy, structural anchor or seismic safety approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledPressureAnchorReactionVectorN",
      label: "Modeled pressure anchor reaction vector n",
      kind: "numberList",
    },
    {
      id: "modeledPressureAnchorResultantN",
      label: "Modeled pressure anchor resultant n",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPipeEndPressuresPa:
        value.observedPipeEndPressuresPa as readonly number[],
      observedEffectiveEndAreasM2:
        value.observedEffectiveEndAreasM2 as readonly number[],
      callerDirectedReactionUnitVectors:
        value.callerDirectedReactionUnitVectors as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
