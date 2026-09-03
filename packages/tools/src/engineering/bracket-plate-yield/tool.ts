import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerPlateYieldPa: number;
  readonly bracketPlateWidthM: number;
  readonly bracketPlateThicknessM: number;
  readonly callerCantileverLoadArmM: number;
}>;
export type Output = Readonly<{
  readonly idealBracketPlasticPointLoadN: number;
}>;
const inputFields = [
  { id: "callerPlateYieldPa", label: "Caller plate yield pa", kind: "number" },
  { id: "bracketPlateWidthM", label: "Bracket plate width m", kind: "number" },
  {
    id: "bracketPlateThicknessM",
    label: "Bracket plate thickness m",
    kind: "number",
  },
  {
    id: "callerCantileverLoadArmM",
    label: "Caller cantilever load arm m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerPlateYieldPa, "callerPlateYieldPa");
  positive(input.bracketPlateWidthM, "bracketPlateWidthM");
  positive(input.bracketPlateThicknessM, "bracketPlateThicknessM");
  positive(input.callerCantileverLoadArmM, "callerCantileverLoadArmM");
  return {
    idealBracketPlasticPointLoadN:
      (input.callerPlateYieldPa *
        input.bracketPlateWidthM *
        input.bracketPlateThicknessM ** 2) /
      (4 * input.callerCantileverLoadArmM),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPlateYieldPa: 100,
  bracketPlateWidthM: 2,
  bracketPlateThicknessM: 0.1,
  callerCantileverLoadArmM: 0.5,
} satisfies Input;
export const exampleOutput = {
  idealBracketPlasticPointLoadN: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/bracket-plate-yield",
  title: "Bracket Plate Yield Calculator",
  description:
    "Ideal rectangular plastic section moment Fy b t²/4 divided by independent cantilever arm, not thin plate local buckling or connection capacity. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealBracketPlasticPointLoadN",
      label: "Ideal bracket plastic point load n",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerPlateYieldPa: value.callerPlateYieldPa as number,
      bracketPlateWidthM: value.bracketPlateWidthM as number,
      bracketPlateThicknessM: value.bracketPlateThicknessM as number,
      callerCantileverLoadArmM: value.callerCantileverLoadArmM as number,
    }),
});
export const run = tool.execute;
export default tool;
