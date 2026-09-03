import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly deepBeamSupportShearN: number;
  readonly callerCompressionStrutAngleRad: number;
  readonly callerIndependentCompressionStrutAreaM2: number;
}>;
export type Output = Readonly<{
  readonly idealDeepBeamDiagonalCompressionPa: number;
}>;
const inputFields = [
  {
    id: "deepBeamSupportShearN",
    label: "Deep beam support shear n",
    kind: "number",
  },
  {
    id: "callerCompressionStrutAngleRad",
    label: "Caller compression strut angle rad",
    kind: "number",
  },
  {
    id: "callerIndependentCompressionStrutAreaM2",
    label: "Caller independent compression strut area m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerCompressionStrutAngleRad,
    "callerCompressionStrutAngleRad",
  );
  positive(
    input.callerIndependentCompressionStrutAreaM2,
    "callerIndependentCompressionStrutAreaM2",
  );
  nonnegative(input.deepBeamSupportShearN, "deepBeamSupportShearN");
  if (input.callerCompressionStrutAngleRad >= Math.PI / 2)
    simpleError(
      "angle",
      "Compression strut angle strictly between zero andπ/2.",
    );
  return {
    idealDeepBeamDiagonalCompressionPa:
      input.deepBeamSupportShearN /
      (Math.sin(input.callerCompressionStrutAngleRad) *
        input.callerIndependentCompressionStrutAreaM2),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  deepBeamSupportShearN: 10,
  callerCompressionStrutAngleRad: 0.5235987755982988,
  callerIndependentCompressionStrutAreaM2: 0.2,
} satisfies Input;
export const exampleOutput = {
  idealDeepBeamDiagonalCompressionPa: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/deep-beam-shear",
  title: "Deep Beam Shear Calculator",
  description:
    "Caller independently resolved diagonal compression strut idealization V/(sinθ A), angle0<θ<π/2, not sectional shallow-beam shear capacity. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealDeepBeamDiagonalCompressionPa",
      label: "Ideal deep beam diagonal compression pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      deepBeamSupportShearN: value.deepBeamSupportShearN as number,
      callerCompressionStrutAngleRad:
        value.callerCompressionStrutAngleRad as number,
      callerIndependentCompressionStrutAreaM2:
        value.callerIndependentCompressionStrutAreaM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
