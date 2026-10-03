import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly centralMoment: number;
  readonly standardDeviation: number;
  readonly order: number;
};
export type Output = { readonly standardizedMoment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centralMoment: { type: "number" },
    standardDeviation: { type: "number", exclusiveMinimum: 0 },
    order: { type: "integer", minimum: 1, maximum: 256 },
  },
  required: ["centralMoment", "standardDeviation", "order"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { standardizedMoment: { type: "number" } },
  required: ["standardizedMoment"],
} as const;
/** Standardize a supplied central moment by its declared order; no bias correction or moment estimation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { centralMoment, standardDeviation, order } = request;
  const compute = (): Output => {
    H.positive(standardDeviation);
    H.integer(order, 1, 256);
    if (centralMoment === 0) return { standardizedMoment: 0 };
    const power = standardDeviation ** order;
    return {
      standardizedMoment:
        power > 0 && Number.isFinite(power)
          ? centralMoment / power
          : Math.sign(centralMoment) *
            Math.exp(
              Math.log(Math.abs(centralMoment)) -
                order * Math.log(standardDeviation),
            ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { centralMoment: 8, standardDeviation: 2, order: 3 },
  output: { standardizedMoment: 1 },
} satisfies ToolExample<Input, Output>;
export const centralMomentStandardizationTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/central-moment-standardization-term",
    title: "Central Moment Standardization Term Tool",
    description:
      "Standardize a supplied central moment by its declared order; no bias correction or moment estimation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centralMoment: { type: "number" },
        standardDeviation: { type: "number", exclusiveMinimum: 0 },
        order: { type: "integer", minimum: 1, maximum: 256 },
      },
      required: ["centralMoment", "standardDeviation", "order"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { standardizedMoment: { type: "number" } },
      required: ["standardizedMoment"],
    },
    ports: {
      inputs: [
        {
          id: "centralMoment",
          label: "Central Moment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "standardDeviation",
          label: "Standard Deviation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "order",
          label: "Order",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "standardizedMoment",
          label: "Standardized Moment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = centralMomentStandardizationTermTool.execute;
export default centralMomentStandardizationTermTool;
