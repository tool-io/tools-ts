import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly nitrogenMassConcentration: number;
  readonly phosphorusMassConcentration: number;
  readonly nitrogenMolarMass: number;
  readonly phosphorusMolarMass: number;
  readonly lowRatioComparison: number;
  readonly highRatioComparison: number;
}>;
export type Output = Readonly<{
  readonly molarNitrogenPhosphorusRatio: number;
  readonly belowLowComparison: boolean;
  readonly aboveHighComparison: boolean;
}>;
const inputFields = [
  {
    id: "nitrogenMassConcentration",
    label: "Nitrogen mass concentration",
    kind: "number",
  },
  {
    id: "phosphorusMassConcentration",
    label: "Phosphorus mass concentration",
    kind: "number",
  },
  { id: "nitrogenMolarMass", label: "Nitrogen molar mass", kind: "number" },
  { id: "phosphorusMolarMass", label: "Phosphorus molar mass", kind: "number" },
  { id: "lowRatioComparison", label: "Low ratio comparison", kind: "number" },
  { id: "highRatioComparison", label: "High ratio comparison", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.phosphorusMassConcentration, "phosphorusMassConcentration");
  positive(input.nitrogenMolarMass, "nitrogenMolarMass");
  positive(input.phosphorusMolarMass, "phosphorusMolarMass");
  positive(input.highRatioComparison, "highRatioComparison");
  nonnegative(input.nitrogenMassConcentration, "nitrogenMassConcentration");
  nonnegative(input.lowRatioComparison, "lowRatioComparison");
  if (input.lowRatioComparison >= input.highRatioComparison)
    simpleError(
      "highRatioComparison",
      "Ordered ratio comparison interval required.",
    );
  const molarNitrogenPhosphorusRatio =
    input.nitrogenMassConcentration /
    input.nitrogenMolarMass /
    (input.phosphorusMassConcentration / input.phosphorusMolarMass);
  return {
    molarNitrogenPhosphorusRatio,
    belowLowComparison: molarNitrogenPhosphorusRatio < input.lowRatioComparison,
    aboveHighComparison:
      molarNitrogenPhosphorusRatio > input.highRatioComparison,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  nitrogenMassConcentration: 14,
  phosphorusMassConcentration: 3.1,
  nitrogenMolarMass: 14,
  phosphorusMolarMass: 31,
  lowRatioComparison: 10,
  highRatioComparison: 20,
} satisfies Input;
export const exampleOutput = {
  molarNitrogenPhosphorusRatio: 10,
  belowLowComparison: false,
  aboveHighComparison: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/nitrogen-phosphorus-ratio-limitation",
  title: "Nitrogen Phosphorus Ratio Limitation Checker",
  description:
    "Convert matched mass N/P concentrations to molar ratio and screen caller bounds; ratios alone cannot diagnose nutrient limitation or bioavailability.",
  inputs: inputFields,
  outputs: [
    {
      id: "molarNitrogenPhosphorusRatio",
      label: "Molar nitrogen phosphorus ratio",
      kind: "number",
    },
    {
      id: "belowLowComparison",
      label: "Below low comparison",
      kind: "boolean",
    },
    {
      id: "aboveHighComparison",
      label: "Above high comparison",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      nitrogenMassConcentration: value.nitrogenMassConcentration as number,
      phosphorusMassConcentration: value.phosphorusMassConcentration as number,
      nitrogenMolarMass: value.nitrogenMolarMass as number,
      phosphorusMolarMass: value.phosphorusMolarMass as number,
      lowRatioComparison: value.lowRatioComparison as number,
      highRatioComparison: value.highRatioComparison as number,
    }),
});
export const run = tool.execute;
export default tool;
