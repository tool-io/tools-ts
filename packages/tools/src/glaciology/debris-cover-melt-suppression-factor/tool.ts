import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly debrisThicknessesM: readonly number[];
  readonly calibratedResistanceLengthM: number;
  readonly bareIceMeltMwePerYear: number;
}>;
export type Output = Readonly<{
  readonly meltSuppressionFactors: readonly number[];
  readonly predictedMeltMwePerYear: readonly number[];
}>;
const inputFields = [
  {
    id: "debrisThicknessesM",
    label: "Debris thicknesses m",
    kind: "numberList",
  },
  {
    id: "calibratedResistanceLengthM",
    label: "Calibrated resistance length m",
    kind: "number",
  },
  {
    id: "bareIceMeltMwePerYear",
    label: "Bare ice melt mwe per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.calibratedResistanceLengthM, "calibratedResistanceLengthM");
  input.debrisThicknessesM.forEach((v) => nonnegative(v, "debrisThicknessesM"));
  nonnegative(input.bareIceMeltMwePerYear, "bareIceMeltMwePerYear");
  if (!input.debrisThicknessesM.length)
    simpleError("debrisThicknessesM", "Nonempty thicknesses required.");
  const meltSuppressionFactors = input.debrisThicknessesM.map(
    (d) => 1 / (1 + d / input.calibratedResistanceLengthM),
  );
  return {
    meltSuppressionFactors,
    predictedMeltMwePerYear: meltSuppressionFactors.map(
      (v) => v * input.bareIceMeltMwePerYear,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  debrisThicknessesM: [0, 0.1, 0.3],
  calibratedResistanceLengthM: 0.1,
  bareIceMeltMwePerYear: 2,
} satisfies Input;
export const exampleOutput = {
  meltSuppressionFactors: [1, 0.5, 0.25],
  predictedMeltMwePerYear: [2, 1, 0.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/debris-cover-melt-suppression-factor",
  title: "Debris Cover Melt Suppression Factor",
  description:
    "Evaluate a calibrated thermal-resistance suppression model for thick insulating debris; thin-debris enhancement and full surface energy balance are excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "meltSuppressionFactors",
      label: "Melt suppression factors",
      kind: "numberList",
    },
    {
      id: "predictedMeltMwePerYear",
      label: "Predicted melt mwe per year",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      debrisThicknessesM: value.debrisThicknessesM as readonly number[],
      calibratedResistanceLengthM: value.calibratedResistanceLengthM as number,
      bareIceMeltMwePerYear: value.bareIceMeltMwePerYear as number,
    }),
});
export const run = tool.execute;
export default tool;
