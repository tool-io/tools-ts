import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly exceededWaveHeightM: number;
  readonly associatedWavePeriodSeconds: number;
  readonly gravityMPerSecondSquared: number;
  readonly heightMultiplier: number;
  readonly correctionMultiplier: number;
}>;
export type Output = Readonly<{ readonly hallermeierClosureDepthM: number }>;
const inputFields = [
  {
    id: "exceededWaveHeightM",
    label: "Exceeded wave height m",
    kind: "number",
  },
  {
    id: "associatedWavePeriodSeconds",
    label: "Associated wave period seconds",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  { id: "heightMultiplier", label: "Height multiplier", kind: "number" },
  {
    id: "correctionMultiplier",
    label: "Correction multiplier",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.exceededWaveHeightM, "exceededWaveHeightM");
  positive(input.associatedWavePeriodSeconds, "associatedWavePeriodSeconds");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  positive(input.heightMultiplier, "heightMultiplier");
  nonnegative(input.correctionMultiplier, "correctionMultiplier");
  const h = input.exceededWaveHeightM;
  return {
    hallermeierClosureDepthM: positive(
      input.heightMultiplier * h -
        (input.correctionMultiplier * h * h) /
          (input.gravityMPerSecondSquared *
            input.associatedWavePeriodSeconds ** 2),
      "closureDepth",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  exceededWaveHeightM: 2,
  associatedWavePeriodSeconds: 10,
  gravityMPerSecondSquared: 10,
  heightMultiplier: 2.28,
  correctionMultiplier: 68.5,
} satisfies Input;
export const exampleOutput = {
  hallermeierClosureDepthM: 4.286,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/closure-depth-hallermeier-formula",
  title: "Closure Depth Hallermeier Formula",
  description:
    "Evaluate a caller-coefficient Hallermeier closure-depth screen using the wave height exceeded for the caller selected duration; empirical applicability and wave statistic selection remain external.",
  inputs: inputFields,
  outputs: [
    {
      id: "hallermeierClosureDepthM",
      label: "Hallermeier closure depth m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      exceededWaveHeightM: value.exceededWaveHeightM as number,
      associatedWavePeriodSeconds: value.associatedWavePeriodSeconds as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      heightMultiplier: value.heightMultiplier as number,
      correctionMultiplier: value.correctionMultiplier as number,
    }),
});
export const run = tool.execute;
export default tool;
