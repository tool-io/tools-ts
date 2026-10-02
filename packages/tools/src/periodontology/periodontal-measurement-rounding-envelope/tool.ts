import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reported: number;
  readonly increment: number;
  readonly rounded: boolean;
};
export type Output = {
  readonly lower: number;
  readonly upperExclusive: number;
  readonly halfwidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reported: { type: "number" },
    increment: { type: "number", exclusiveMinimum: 0 },
    rounded: { type: "boolean" },
  },
  required: ["reported", "increment", "rounded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upperExclusive: { type: "number" },
    halfwidth: { type: "number" },
  },
  required: ["lower", "upperExclusive", "halfwidth"],
} as const;
/** Calculate periodontal measurement rounding envelope from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reported, increment, rounded } = request;
  const compute = (): Output => {
    H.positive(increment);
    return {
      lower: rounded ? reported - increment / 2 : reported,
      upperExclusive: rounded ? reported + increment / 2 : reported + increment,
      halfwidth: increment / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reported: 3, increment: 1, rounded: true },
  output: { lower: 2.5, upperExclusive: 3.5, halfwidth: 0.5 },
} satisfies ToolExample<Input, Output>;
export const periodontalMeasurementRoundingEnvelopeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "periodontology/periodontal-measurement-rounding-envelope",
      title: "Periodontal Measurement Rounding Envelope Tool",
      description:
        "Calculate periodontal measurement rounding envelope from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reported: { type: "number" },
          increment: { type: "number", exclusiveMinimum: 0 },
          rounded: { type: "boolean" },
        },
        required: ["reported", "increment", "rounded"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lower: { type: "number" },
          upperExclusive: { type: "number" },
          halfwidth: { type: "number" },
        },
        required: ["lower", "upperExclusive", "halfwidth"],
      },
      ports: {
        inputs: [
          {
            id: "reported",
            label: "Reported",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "increment",
            label: "Increment",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rounded",
            label: "Rounded",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "lower", label: "Lower", valueType: { type: "number" } },
          {
            id: "upperExclusive",
            label: "Upper Exclusive",
            valueType: { type: "number" },
          },
          {
            id: "halfwidth",
            label: "Halfwidth",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = periodontalMeasurementRoundingEnvelopeTool.execute;
export default periodontalMeasurementRoundingEnvelopeTool;
