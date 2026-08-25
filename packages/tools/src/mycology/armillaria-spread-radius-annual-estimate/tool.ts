import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ArmillariaSpreadEstimatorInput = {
  readonly observationYears: number;
  readonly radiusExtensionM: number;
};

export type ArmillariaSpreadEstimatorOutput = {
  readonly annualSpreadRadiusM: number;
};

export const armillariaSpreadEstimatorExample = {
  input: { observationYears: 2, radiusExtensionM: 3 },
  output: { annualSpreadRadiusM: 1.5 },
} satisfies ToolExample<
  ArmillariaSpreadEstimatorInput,
  ArmillariaSpreadEstimatorOutput
>;

export const calculateArmillariaSpreadEstimator = (
  input: ArmillariaSpreadEstimatorInput,
): ArmillariaSpreadEstimatorOutput => {
  if (!Number.isFinite(input.radiusExtensionM) || input.radiusExtensionM < 0)
    return simpleError(
      "radiusExtensionM",
      "Observed radius extension must be finite and non-negative.",
      "invalid_extension",
    );
  if (!(
    Number.isSafeInteger(input.observationYears) && input.observationYears >= 1
  ))
    return simpleError(
      "observationYears",
      "Observation time must be a whole number of at least one year.",
      "invalid_years",
    );
  const annualSpreadRadiusM = input.radiusExtensionM / input.observationYears;
  if (!Number.isFinite(annualSpreadRadiusM))
    return simpleError(
      "radiusExtensionM",
      "The annual spread estimate is outside the representable range.",
      "result_out_of_range",
    );
  return { annualSpreadRadiusM };
};

export const armillariaSpreadEstimatorTool = createSimpleTool({
  id: "mycology/armillaria-spread-radius-annual-estimate",
  title: "Armillaria Annual Spread",
  description:
    "Estimate average annual radial spread of an Armillaria genet from measured radius extension over a whole-year observation interval.",
  inputs: [
    {
      id: "radiusExtensionM",
      kind: "number",
      label: "Radius extension",
      minimum: 0,
      unit: "m",
    },
    {
      id: "observationYears",
      kind: "integer",
      label: "Observation years",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "annualSpreadRadiusM",
      kind: "number",
      label: "Annual spread radius",
      unit: "m/year",
    },
  ],
  calculate: (input) =>
    calculateArmillariaSpreadEstimator({
      observationYears: input.observationYears as number,
      radiusExtensionM: input.radiusExtensionM as number,
    }),
});
export const runArmillariaSpreadEstimator =
  armillariaSpreadEstimatorTool.execute;
export default armillariaSpreadEstimatorTool;
