import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly ovenDrySampleMassGrams: number;
  readonly postIgnitionResidueMassGrams: number;
  readonly blankApparentMassLossGrams: number;
  readonly callerMineralVolatilizationCorrectionGrams: number;
}>;
export type Output = Readonly<{
  readonly correctedIgnitionLossMassGrams: number;
  readonly correctedIgnitionLossPercent: number;
}>;
const inputFields = [
  {
    id: "ovenDrySampleMassGrams",
    label: "Oven dry sample mass grams",
    kind: "number",
  },
  {
    id: "postIgnitionResidueMassGrams",
    label: "Post ignition residue mass grams",
    kind: "number",
  },
  {
    id: "blankApparentMassLossGrams",
    label: "Blank apparent mass loss grams",
    kind: "number",
  },
  {
    id: "callerMineralVolatilizationCorrectionGrams",
    label: "Caller mineral volatilization correction grams",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.ovenDrySampleMassGrams, "ovenDrySampleMassGrams");
  nonnegative(
    input.postIgnitionResidueMassGrams,
    "postIgnitionResidueMassGrams",
  );
  nonnegative(input.blankApparentMassLossGrams, "blankApparentMassLossGrams");
  nonnegative(
    input.callerMineralVolatilizationCorrectionGrams,
    "callerMineralVolatilizationCorrectionGrams",
  );
  if (input.postIgnitionResidueMassGrams > input.ovenDrySampleMassGrams)
    simpleError(
      "postIgnitionResidueMassGrams",
      "Residue cannot exceed sampled oven-dry mass in this loss protocol.",
    );
  const correctedIgnitionLossMassGrams =
    input.ovenDrySampleMassGrams -
    input.postIgnitionResidueMassGrams -
    input.blankApparentMassLossGrams -
    input.callerMineralVolatilizationCorrectionGrams;
  return {
    correctedIgnitionLossMassGrams,
    correctedIgnitionLossPercent:
      (100 * correctedIgnitionLossMassGrams) / input.ovenDrySampleMassGrams,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  ovenDrySampleMassGrams: 10,
  postIgnitionResidueMassGrams: 9,
  blankApparentMassLossGrams: 0.1,
  callerMineralVolatilizationCorrectionGrams: 0.2,
} satisfies Input;
export const exampleOutput = {
  correctedIgnitionLossMassGrams: 0.7,
  correctedIgnitionLossPercent: 7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/soil-organic-matter-percentage",
  title: "Agriculture Soil Organic Matter Percentage",
  description:
    "Report blank/mineral-corrected soil loss-on-ignition as a caller protocol organic-matter proxy, retaining negative nondetections; does not equate every thermal loss to organic carbon or embed a carbon-to-OM factor.",
  inputs: inputFields,
  outputs: [
    {
      id: "correctedIgnitionLossMassGrams",
      label: "Corrected ignition loss mass grams",
      kind: "number",
    },
    {
      id: "correctedIgnitionLossPercent",
      label: "Corrected ignition loss percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      ovenDrySampleMassGrams: value.ovenDrySampleMassGrams as number,
      postIgnitionResidueMassGrams:
        value.postIgnitionResidueMassGrams as number,
      blankApparentMassLossGrams: value.blankApparentMassLossGrams as number,
      callerMineralVolatilizationCorrectionGrams:
        value.callerMineralVolatilizationCorrectionGrams as number,
    }),
});
export const run = tool.execute;
export default tool;
