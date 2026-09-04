import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, navier } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly plateLengthM: number;
  readonly plateWidthM: number;
  readonly callerFlexuralRigidityNm: number;
  readonly uniformPressurePa: number;
  readonly queryXM: number;
  readonly queryYM: number;
  readonly oddTermsPerDirection: number;
}>;
export type Output = Readonly<{ readonly truncatedNavierDeflectionM: number }>;
const inputFields = [
  { id: "plateLengthM", label: "Plate length m", kind: "number" },
  { id: "plateWidthM", label: "Plate width m", kind: "number" },
  {
    id: "callerFlexuralRigidityNm",
    label: "Caller flexural rigidity nm",
    kind: "number",
  },
  { id: "uniformPressurePa", label: "Uniform pressure pa", kind: "number" },
  { id: "queryXM", label: "Query x m", kind: "number" },
  { id: "queryYM", label: "Query y m", kind: "number" },
  {
    id: "oddTermsPerDirection",
    label: "Odd terms per direction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    truncatedNavierDeflectionM: navier(
      input.plateLengthM,
      input.plateWidthM,
      input.callerFlexuralRigidityNm,
      input.uniformPressurePa,
      input.queryXM,
      input.queryYM,
      input.oddTermsPerDirection,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  plateLengthM: 1,
  plateWidthM: 1,
  callerFlexuralRigidityNm: 1,
  uniformPressurePa: 1,
  queryXM: 0.5,
  queryYM: 0.5,
  oddTermsPerDirection: 1,
} satisfies Input;
export const exampleOutput = {
  truncatedNavierDeflectionM: 0.00416064589318341,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/plate-navier-bending",
  title: "Plate Navier Bending Calculator",
  description:
    "Bounded Navier odd double sine series for uniformly loaded simply supported rectangular Kirchhoff plate; truncation explicitly caller controlled, no certified convergence. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "truncatedNavierDeflectionM",
      label: "Truncated navier deflection m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      plateLengthM: value.plateLengthM as number,
      plateWidthM: value.plateWidthM as number,
      callerFlexuralRigidityNm: value.callerFlexuralRigidityNm as number,
      uniformPressurePa: value.uniformPressurePa as number,
      queryXM: value.queryXM as number,
      queryYM: value.queryYM as number,
      oddTermsPerDirection: value.oddTermsPerDirection as number,
    }),
});
export const run = tool.execute;
export default tool;
