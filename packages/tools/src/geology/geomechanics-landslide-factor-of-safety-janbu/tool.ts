import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, janbu } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly sliceWidths: readonly number[];
  readonly sliceWeights: readonly number[];
  readonly porePressures: readonly number[];
  readonly cohesions: readonly number[];
  readonly frictionRadians: readonly number[];
  readonly baseRadians: readonly number[];
  readonly independentJanbuCorrection: number;
}>;
export type Output = Readonly<{
  readonly janbuSimplifiedFactor: number;
  readonly equilibriumResidual: number;
}>;
const inputFields = [
  { id: "sliceWidths", label: "Slice widths", kind: "numberList" },
  { id: "sliceWeights", label: "Slice weights", kind: "numberList" },
  { id: "porePressures", label: "Pore pressures", kind: "numberList" },
  { id: "cohesions", label: "Cohesions", kind: "numberList" },
  { id: "frictionRadians", label: "Friction radians", kind: "numberList" },
  { id: "baseRadians", label: "Base radians", kind: "numberList" },
  {
    id: "independentJanbuCorrection",
    label: "Independent janbu correction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return janbu(
    input.sliceWidths,
    input.sliceWeights,
    input.porePressures,
    input.cohesions,
    input.frictionRadians,
    input.baseRadians,
    input.independentJanbuCorrection,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sliceWidths: [1],
  sliceWeights: [1],
  porePressures: [0],
  cohesions: [1],
  frictionRadians: [0],
  baseRadians: [0.7853981633974483],
  independentJanbuCorrection: 1,
} satisfies Input;
export const exampleOutput = {
  janbuSimplifiedFactor: 2,
  equilibriumResidual: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/geomechanics-landslide-factor-of-safety-janbu",
  title: "Geology Geomechanics Landslide Factor Of Safety Janbu Calculator",
  description:
    "Bounded positive-branch Janbu simplified slice equilibrium with independent correction factor, pore pressure/friction actual slice evidence; not a Bishop formula renamed or slope safety certification. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "janbuSimplifiedFactor",
      label: "Janbu simplified factor",
      kind: "number",
    },
    {
      id: "equilibriumResidual",
      label: "Equilibrium residual",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sliceWidths: value.sliceWidths as readonly number[],
      sliceWeights: value.sliceWeights as readonly number[],
      porePressures: value.porePressures as readonly number[],
      cohesions: value.cohesions as readonly number[],
      frictionRadians: value.frictionRadians as readonly number[],
      baseRadians: value.baseRadians as readonly number[],
      independentJanbuCorrection: value.independentJanbuCorrection as number,
    }),
});
export const run = tool.execute;
export default tool;
