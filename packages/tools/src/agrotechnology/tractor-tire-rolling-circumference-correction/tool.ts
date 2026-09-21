import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominalCircumference: number;
  readonly distance: number;
  readonly revolutions: number;
};
export type Output = {
  readonly measuredCircumference: number;
  readonly correctionFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalCircumference: { type: "number", exclusiveMinimum: 0 },
    distance: { type: "number", minimum: 0 },
    revolutions: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["nominalCircumference", "distance", "revolutions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredCircumference: { type: "number" },
    correctionFactor: { type: "number" },
  },
  required: ["measuredCircumference", "correctionFactor"],
} as const;
/** Calculate tractor tire rolling circumference correction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nominalCircumference, distance, revolutions } = request;
  const compute = (): Output => {
    H.positive(nominalCircumference);
    H.positive(revolutions);
    H.domain(distance >= 0);
    return {
      measuredCircumference: distance / revolutions,
      correctionFactor: distance / (revolutions * nominalCircumference),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nominalCircumference: 2, distance: 190, revolutions: 100 },
  output: { measuredCircumference: 1.9, correctionFactor: 0.95 },
} satisfies ToolExample<Input, Output>;
export const tractorTireRollingCircumferenceCorrectionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agrotechnology/tractor-tire-rolling-circumference-correction",
      title: "Tractor Tire Rolling Circumference Correction Tool",
      description:
        "Calculate tractor tire rolling circumference correction from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nominalCircumference: { type: "number", exclusiveMinimum: 0 },
          distance: { type: "number", minimum: 0 },
          revolutions: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["nominalCircumference", "distance", "revolutions"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measuredCircumference: { type: "number" },
          correctionFactor: { type: "number" },
        },
        required: ["measuredCircumference", "correctionFactor"],
      },
      ports: {
        inputs: [
          {
            id: "nominalCircumference",
            label: "Nominal Circumference",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "distance",
            label: "Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "revolutions",
            label: "Revolutions",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "measuredCircumference",
            label: "Measured Circumference",
            valueType: { type: "number" },
          },
          {
            id: "correctionFactor",
            label: "Correction Factor",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = tractorTireRollingCircumferenceCorrectionTool.execute;
export default tractorTireRollingCircumferenceCorrectionTool;
