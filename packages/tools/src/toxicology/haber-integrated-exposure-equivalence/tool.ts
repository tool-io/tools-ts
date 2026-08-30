import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly concentrationSegments: readonly number[];
  readonly segmentDurationsHours: readonly number[];
  readonly referenceConcentration: number;
}>;
export type Output = Readonly<{
  readonly concentrationTimeIntegral: number;
  readonly equivalentReferenceHours: number;
}>;
const inputFields = [
  {
    id: "concentrationSegments",
    label: "Concentration segments",
    kind: "numberList",
  },
  {
    id: "segmentDurationsHours",
    label: "Segment durations hours",
    kind: "numberList",
  },
  {
    id: "referenceConcentration",
    label: "Reference concentration",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.concentrationSegments,
    input.segmentDurationsHours,
    "concentrationSegments",
  );
  input.concentrationSegments.forEach((v) =>
    nonnegative(v, "concentrationSegments"),
  );
  input.segmentDurationsHours.forEach((v) =>
    nonnegative(v, "segmentDurationsHours"),
  );
  positive(input.referenceConcentration, "referenceConcentration");
  const concentrationTimeIntegral = input.concentrationSegments.reduce(
    (s, v, i) => s + v * input.segmentDurationsHours[i],
    0,
  );
  return {
    concentrationTimeIntegral,
    equivalentReferenceHours:
      concentrationTimeIntegral / input.referenceConcentration,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  concentrationSegments: [10, 20],
  segmentDurationsHours: [1, 2],
  referenceConcentration: 5,
} satisfies Input;
export const exampleOutput = {
  concentrationTimeIntegral: 50,
  equivalentReferenceHours: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/haber-integrated-exposure-equivalence",
  title: "Haber Time Scaling",
  description:
    "Integrate piecewise concentration×time and express equivalent duration under the n=1 Haber assumption; toxicodynamic recovery and concentration-dependent exponents are excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "concentrationTimeIntegral",
      label: "Concentration time integral",
      kind: "number",
    },
    {
      id: "equivalentReferenceHours",
      label: "Equivalent reference hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      concentrationSegments: value.concentrationSegments as readonly number[],
      segmentDurationsHours: value.segmentDurationsHours as readonly number[],
      referenceConcentration: value.referenceConcentration as number,
    }),
});
export const run = tool.execute;
export default tool;
