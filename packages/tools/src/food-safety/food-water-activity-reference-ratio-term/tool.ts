import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleVaporPressure: number;
  readonly referenceVaporPressure: number;
  readonly sameTemperature: boolean;
};
export type Output = { readonly activityRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleVaporPressure: { type: "number", minimum: 0 },
    referenceVaporPressure: { type: "number", exclusiveMinimum: 0 },
    sameTemperature: { type: "boolean" },
  },
  required: [
    "sampleVaporPressure",
    "referenceVaporPressure",
    "sameTemperature",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { activityRatio: { type: "number" } },
  required: ["activityRatio"],
} as const;
/** Dimensionless vapor-pressure ratio with an explicit same-temperature assertion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleVaporPressure, referenceVaporPressure, sameTemperature } =
    request;
  const compute = (): Output => {
    H.positive(referenceVaporPressure);
    H.domain(
      sampleVaporPressure >= 0 &&
        sampleVaporPressure <= referenceVaporPressure &&
        sameTemperature,
    );
    return { activityRatio: sampleVaporPressure / referenceVaporPressure };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleVaporPressure: 2,
    referenceVaporPressure: 4,
    sameTemperature: true,
  },
  output: { activityRatio: 0.5 },
} satisfies ToolExample<Input, Output>;
export const foodWaterActivityReferenceRatioTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-safety/food-water-activity-reference-ratio-term",
      title: "Food Water Activity Reference Ratio Term Tool",
      description:
        "Dimensionless vapor-pressure ratio with an explicit same-temperature assertion.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sampleVaporPressure: { type: "number", minimum: 0 },
          referenceVaporPressure: { type: "number", exclusiveMinimum: 0 },
          sameTemperature: { type: "boolean" },
        },
        required: [
          "sampleVaporPressure",
          "referenceVaporPressure",
          "sameTemperature",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { activityRatio: { type: "number" } },
        required: ["activityRatio"],
      },
      ports: {
        inputs: [
          {
            id: "sampleVaporPressure",
            label: "Sample Vapor Pressure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceVaporPressure",
            label: "Reference Vapor Pressure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sameTemperature",
            label: "Same Temperature",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "activityRatio",
            label: "Activity Ratio",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = foodWaterActivityReferenceRatioTermTool.execute;
export default foodWaterActivityReferenceRatioTermTool;
