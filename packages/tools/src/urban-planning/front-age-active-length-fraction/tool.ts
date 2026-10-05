import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activeLength: number;
  readonly totalFrontage: number;
};
export type Output = {
  readonly activeFraction: number;
  readonly inactiveLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeLength: { type: "number", minimum: 0 },
    totalFrontage: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["activeLength", "totalFrontage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeFraction: { type: "number" },
    inactiveLength: { type: "number" },
  },
  required: ["activeFraction", "inactiveLength"],
} as const;
/** Describe explicitly coded active street frontage as a fraction of a measured total, without deciding what qualifies as active. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activeLength, totalFrontage } = request;
  const compute = (): Output => {
    (H.domain(totalFrontage > 0, "totalFrontage"), totalFrontage);
    H.domain(
      activeLength >= 0 && activeLength <= totalFrontage,
      "activeLength",
    );
    return {
      activeFraction: activeLength / totalFrontage,
      inactiveLength: totalFrontage - activeLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { activeLength: 60, totalFrontage: 80 },
  output: { activeFraction: 0.75, inactiveLength: 20 },
} satisfies ToolExample<Input, Output>;
export const frontAgeActiveLengthFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/front-age-active-length-fraction",
    title: "Frontage Active Length Fraction Tool",
    description:
      "Describe explicitly coded active street frontage as a fraction of a measured total, without deciding what qualifies as active.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeLength: { type: "number", minimum: 0 },
        totalFrontage: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["activeLength", "totalFrontage"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeFraction: { type: "number" },
        inactiveLength: { type: "number" },
      },
      required: ["activeFraction", "inactiveLength"],
    },
    ports: {
      inputs: [
        {
          id: "activeLength",
          label: "Active Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalFrontage",
          label: "Total Frontage",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "activeFraction",
          label: "Active Fraction",
          valueType: { type: "number" },
        },
        {
          id: "inactiveLength",
          label: "Inactive Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = frontAgeActiveLengthFractionTool.execute;
export default frontAgeActiveLengthFractionTool;
