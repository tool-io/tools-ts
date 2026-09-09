import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyMatchedLangmuirGasCapacityVolumePerMass: number;
  readonly callerMatchedLangmuirPressurePascals: number;
  readonly actualPressurePascals: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyMatchedLangmuirGasCapacityVolumePerMass",
    label: "Caller independently matched langmuir gas capacity volume per mass",
    kind: "number",
  },
  {
    id: "callerMatchedLangmuirPressurePascals",
    label: "Caller matched langmuir pressure pascals",
    kind: "number",
  },
  {
    id: "actualPressurePascals",
    label: "Actual pressure pascals",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerIndependentlyMatchedLangmuirGasCapacityVolumePerMass,
    "capacity",
  );
  positive(input.callerMatchedLangmuirPressurePascals, "PL");
  nonnegative(input.actualPressurePascals, "P");
  return {
    conditionalCoalAdsorbedGasVolumePerMass:
      (input.callerIndependentlyMatchedLangmuirGasCapacityVolumePerMass *
        input.actualPressurePascals) /
      (input.callerMatchedLangmuirPressurePascals +
        input.actualPressurePascals),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyMatchedLangmuirGasCapacityVolumePerMass: 10,
    callerMatchedLangmuirPressurePascals: 2,
    actualPressurePascals: 2,
  },
  output: { result: { conditionalCoalAdsorbedGasVolumePerMass: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/geomechanics-coal-gas-content-langmuir",
  title: "Geology Geomechanics Coal Gas Content Langmuir Calculator",
  description:
    "Calibrated coal LangmuirgasCONTENTVL P/(PL+P), actual moisture/temperature and gas reference-volume basis required. Not chemistry fractional surface coverage or total free+adsorbed gas.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
