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
  integral,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedStopeStationsM: readonly number[];
  readonly observedStopeCrossSectionAreasM2: readonly number[];
  readonly observedIndependentExcludedVoidM3: number;
}>;
export type Output = Readonly<{
  readonly surveyedStopeGrossM3: number;
  readonly surveyedStopeNetM3: number;
}>;
const inputFields = [
  {
    id: "observedStopeStationsM",
    label: "Observed stope stations m",
    kind: "numberList",
  },
  {
    id: "observedStopeCrossSectionAreasM2",
    label: "Observed stope cross section areas m2",
    kind: "numberList",
  },
  {
    id: "observedIndependentExcludedVoidM3",
    label: "Observed independent excluded void m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedStopeCrossSectionAreasM2.forEach((v) =>
    nonnegative(v, "observedStopeCrossSectionAreasM2"),
  );
  nonnegative(
    input.observedIndependentExcludedVoidM3,
    "observedIndependentExcludedVoidM3",
  );
  const gross = integral(
    input.observedStopeStationsM,
    input.observedStopeCrossSectionAreasM2,
  );
  if (input.observedIndependentExcludedVoidM3 > gross)
    simpleError("void", "Excluded independently surveyed void≤gross envelope.");
  return {
    surveyedStopeGrossM3: gross,
    surveyedStopeNetM3: gross - input.observedIndependentExcludedVoidM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedStopeStationsM: [0, 1, 3],
  observedStopeCrossSectionAreasM2: [2, 4, 4],
  observedIndependentExcludedVoidM3: 1,
} satisfies Input;
export const exampleOutput = {
  surveyedStopeGrossM3: 11,
  surveyedStopeNetM3: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/stope-volume",
  title: "Stope Volume Calculator",
  description:
    "Integrate actual unequal-station stope cross-section survey and independent excluded cavity, not rectangular volume or one-prism log rule. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "surveyedStopeGrossM3",
      label: "Surveyed stope gross m3",
      kind: "number",
    },
    {
      id: "surveyedStopeNetM3",
      label: "Surveyed stope net m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedStopeStationsM: value.observedStopeStationsM as readonly number[],
      observedStopeCrossSectionAreasM2:
        value.observedStopeCrossSectionAreasM2 as readonly number[],
      observedIndependentExcludedVoidM3:
        value.observedIndependentExcludedVoidM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
