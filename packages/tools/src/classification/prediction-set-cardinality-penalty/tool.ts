import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cardinality: number;
  readonly freeLabels: number;
  readonly costPerExtra: number;
};
export type Output = { readonly extra: number; readonly penalty: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cardinality: { type: "integer", minimum: 0 },
    freeLabels: { type: "integer", minimum: 0 },
    costPerExtra: { type: "number", minimum: 0 },
  },
  required: ["cardinality", "freeLabels", "costPerExtra"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { extra: { type: "integer" }, penalty: { type: "number" } },
  required: ["extra", "penalty"],
} as const;
/** Calculate prediction set cardinality penalty from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cardinality, freeLabels, costPerExtra } = request;
  const compute = (): Output => {
    H.integer(cardinality, 0);
    H.integer(freeLabels, 0);
    H.domain(costPerExtra >= 0);
    const extra = Math.max(0, cardinality - freeLabels);
    return { extra, penalty: extra * costPerExtra };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cardinality: 5, freeLabels: 2, costPerExtra: 0.5 },
  output: { extra: 3, penalty: 1.5 },
} satisfies ToolExample<Input, Output>;
export const predictionSetCardinalityPenaltyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/prediction-set-cardinality-penalty",
    title: "Prediction Set Cardinality Penalty Tool",
    description:
      "Calculate prediction set cardinality penalty from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cardinality: { type: "integer", minimum: 0 },
        freeLabels: { type: "integer", minimum: 0 },
        costPerExtra: { type: "number", minimum: 0 },
      },
      required: ["cardinality", "freeLabels", "costPerExtra"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { extra: { type: "integer" }, penalty: { type: "number" } },
      required: ["extra", "penalty"],
    },
    ports: {
      inputs: [
        {
          id: "cardinality",
          label: "Cardinality",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "freeLabels",
          label: "Free Labels",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "costPerExtra",
          label: "Cost Per Extra",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "extra", label: "Extra", valueType: { type: "integer" } },
        { id: "penalty", label: "Penalty", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = predictionSetCardinalityPenaltyTool.execute;
export default predictionSetCardinalityPenaltyTool;
