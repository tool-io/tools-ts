import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly lineLoadNPerM: number;
  readonly flexuralRigidityNM: number;
  readonly foundationStiffnessNPerM3: number;
  readonly distancesM: readonly number[];
}>;
export type Output = Readonly<{ readonly deflectionsM: readonly number[] }>;
const inputFields = [
  { id: "lineLoadNPerM", label: "Line load n per m", kind: "number" },
  { id: "flexuralRigidityNM", label: "Flexural rigidity n m", kind: "number" },
  {
    id: "foundationStiffnessNPerM3",
    label: "Foundation stiffness n per m3",
    kind: "number",
  },
  { id: "distancesM", label: "Distances m", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.flexuralRigidityNM, "flexuralRigidityNM");
  positive(input.foundationStiffnessNPerM3, "foundationStiffnessNPerM3");
  nonnegative(input.lineLoadNPerM, "lineLoadNPerM");
  input.distancesM.forEach((v) => nonnegative(v, "distancesM"));
  const a =
    ((4 * input.flexuralRigidityNM) / input.foundationStiffnessNPerM3) ** 0.25;
  return {
    deflectionsM: input.distancesM.map(
      (x) =>
        (input.lineLoadNPerM / (2 * input.foundationStiffnessNPerM3 * a)) *
        Math.exp(-x / a) *
        (Math.cos(x / a) + Math.sin(x / a)),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lineLoadNPerM: 8,
  flexuralRigidityNM: 1,
  foundationStiffnessNPerM3: 4,
  distancesM: [0, 1],
} satisfies Input;
export const exampleOutput = {
  deflectionsM: [1, 0.5083259859995252],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/foreland-basin-flexural-subsidence",
  title: "Geology Foreland Basin Flexural Subsidence Calculator",
  description:
    "Infinite elastic beam/plate strip on linear buoyant foundation under line load; signed forebulge retained, not local Airy compensation. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [{ id: "deflectionsM", label: "Deflections m", kind: "numberList" }],
  calculate: (value) =>
    calculate({
      lineLoadNPerM: value.lineLoadNPerM as number,
      flexuralRigidityNM: value.flexuralRigidityNM as number,
      foundationStiffnessNPerM3: value.foundationStiffnessNPerM3 as number,
      distancesM: value.distancesM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
