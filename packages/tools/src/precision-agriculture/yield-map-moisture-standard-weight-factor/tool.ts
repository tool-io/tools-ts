import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedMass: number;
  readonly measuredMoisture: number;
  readonly referenceMoisture: number;
};
export type Output = { readonly standardMass: number; readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedMass: { type: "number", minimum: 0 },
    measuredMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    referenceMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["observedMass", "measuredMoisture", "referenceMoisture"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { standardMass: { type: "number" }, factor: { type: "number" } },
  required: ["standardMass", "factor"],
} as const;
/** Calculate yield map moisture standard weight factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedMass, measuredMoisture, referenceMoisture } = request;
  const compute = (): Output => {
    H.domain(
      observedMass >= 0 &&
        measuredMoisture >= 0 &&
        measuredMoisture < 1 &&
        referenceMoisture >= 0 &&
        referenceMoisture < 1,
    );
    return {
      standardMass:
        (observedMass * (1 - measuredMoisture)) / (1 - referenceMoisture),
      factor: (1 - measuredMoisture) / (1 - referenceMoisture),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedMass: 100, measuredMoisture: 0.2, referenceMoisture: 0.1 },
  output: { standardMass: 88.88888888888889, factor: 0.888888888888889 },
} satisfies ToolExample<Input, Output>;
export const yieldMapMoistureStandardWeightFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "precision-agriculture/yield-map-moisture-standard-weight-factor",
      title: "Yield Map Moisture Standard Weight Factor Tool",
      description:
        "Calculate yield map moisture standard weight factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedMass: { type: "number", minimum: 0 },
          measuredMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
          referenceMoisture: {
            type: "number",
            minimum: 0,
            exclusiveMaximum: 1,
          },
        },
        required: ["observedMass", "measuredMoisture", "referenceMoisture"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          standardMass: { type: "number" },
          factor: { type: "number" },
        },
        required: ["standardMass", "factor"],
      },
      ports: {
        inputs: [
          {
            id: "observedMass",
            label: "Observed Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "measuredMoisture",
            label: "Measured Moisture",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceMoisture",
            label: "Reference Moisture",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "standardMass",
            label: "Standard Mass",
            valueType: { type: "number" },
          },
          { id: "factor", label: "Factor", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = yieldMapMoistureStandardWeightFactorTool.execute;
export default yieldMapMoistureStandardWeightFactorTool;
