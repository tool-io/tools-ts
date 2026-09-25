import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly greenConcentration: number;
  readonly senescentConcentration: number;
  readonly senescentGreenMassRatio: number;
};
export type Output = {
  readonly uncorrectedEfficiency: number;
  readonly massCorrectedEfficiency: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    greenConcentration: { type: "number", exclusiveMinimum: 0 },
    senescentConcentration: { type: "number", minimum: 0 },
    senescentGreenMassRatio: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "greenConcentration",
    "senescentConcentration",
    "senescentGreenMassRatio",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncorrectedEfficiency: { type: "number" },
    massCorrectedEfficiency: { type: "number" },
  },
  required: ["uncorrectedEfficiency", "massCorrectedEfficiency"],
} as const;
/** Nutrient resorption with an explicit senescent-to-green dry-mass retention correction; negative efficiencies remain visible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    greenConcentration,
    senescentConcentration,
    senescentGreenMassRatio,
  } = request;
  const compute = (): Output => {
    H.positive(greenConcentration);
    H.domain(senescentConcentration >= 0 && senescentGreenMassRatio > 0);
    return {
      uncorrectedEfficiency: 1 - senescentConcentration / greenConcentration,
      massCorrectedEfficiency:
        1 -
        (senescentConcentration * senescentGreenMassRatio) / greenConcentration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    greenConcentration: 20,
    senescentConcentration: 10,
    senescentGreenMassRatio: 0.8,
  },
  output: { uncorrectedEfficiency: 0.5, massCorrectedEfficiency: 0.6 },
} satisfies ToolExample<Input, Output>;
export const nutrientResorptionMassLossCorrectionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ecology/nutrient-resorption-mass-loss-correction-term",
      title: "Nutrient Resorption Mass Loss Correction Term Tool",
      description:
        "Nutrient resorption with an explicit senescent-to-green dry-mass retention correction; negative efficiencies remain visible.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          greenConcentration: { type: "number", exclusiveMinimum: 0 },
          senescentConcentration: { type: "number", minimum: 0 },
          senescentGreenMassRatio: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "greenConcentration",
          "senescentConcentration",
          "senescentGreenMassRatio",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          uncorrectedEfficiency: { type: "number" },
          massCorrectedEfficiency: { type: "number" },
        },
        required: ["uncorrectedEfficiency", "massCorrectedEfficiency"],
      },
      ports: {
        inputs: [
          {
            id: "greenConcentration",
            label: "Green Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "senescentConcentration",
            label: "Senescent Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "senescentGreenMassRatio",
            label: "Senescent Green Mass Ratio",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "uncorrectedEfficiency",
            label: "Uncorrected Efficiency",
            valueType: { type: "number" },
          },
          {
            id: "massCorrectedEfficiency",
            label: "Mass Corrected Efficiency",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = nutrientResorptionMassLossCorrectionTermTool.execute;
export default nutrientResorptionMassLossCorrectionTermTool;
