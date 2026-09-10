import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly actualCollectedFluidMl: number;
  readonly independentlyEstimatedNonBloodFluidMl: number;
  readonly observedWetMaterialMassGrams: number;
  readonly verifiedDryMaterialMassGrams: number;
  readonly callerVerifiedBloodDensityGramsPerMl: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCollectedFluidMl",
    label: "Actual collected fluid ml",
    kind: "number",
  },
  {
    id: "independentlyEstimatedNonBloodFluidMl",
    label: "Independently estimated non blood fluid ml",
    kind: "number",
  },
  {
    id: "observedWetMaterialMassGrams",
    label: "Observed wet material mass grams",
    kind: "number",
  },
  {
    id: "verifiedDryMaterialMassGrams",
    label: "Verified dry material mass grams",
    kind: "number",
  },
  {
    id: "callerVerifiedBloodDensityGramsPerMl",
    label: "Caller verified blood density grams per ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.actualCollectedFluidMl,
    input.independentlyEstimatedNonBloodFluidMl,
    input.observedWetMaterialMassGrams,
    input.verifiedDryMaterialMassGrams,
  ].forEach((v) => nonnegative(v, "inventory"));
  positive(input.callerVerifiedBloodDensityGramsPerMl, "density");
  if (
    input.independentlyEstimatedNonBloodFluidMl >
      input.actualCollectedFluidMl ||
    input.verifiedDryMaterialMassGrams > input.observedWetMaterialMassGrams
  )
    simpleError(
      "inventory",
      "Independent nonblood/dry values within matched observations.",
    );
  return {
    conditionalQuantifiedBloodVolumeMl:
      input.actualCollectedFluidMl -
      input.independentlyEstimatedNonBloodFluidMl +
      (input.observedWetMaterialMassGrams -
        input.verifiedDryMaterialMassGrams) /
        input.callerVerifiedBloodDensityGramsPerMl,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCollectedFluidMl: 500,
    independentlyEstimatedNonBloodFluidMl: 100,
    observedWetMaterialMassGrams: 200,
    verifiedDryMaterialMassGrams: 100,
    callerVerifiedBloodDensityGramsPerMl: 1,
  },
  output: { result: { conditionalQuantifiedBloodVolumeMl: 500 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/blood-loss-estimate",
  title: "Blood Loss Estimate Calculator",
  description:
    "Conditional collected-fluid minus independently estimated nonblood content plus matched wet-minus-dry mass/density. Actual disjoint inventories, fluid contamination and density applicability essential; not diagnose haemorrhage or substitute urgent clinical assessment.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
