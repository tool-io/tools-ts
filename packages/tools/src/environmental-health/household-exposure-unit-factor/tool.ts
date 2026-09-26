import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly recorded: number; readonly unitFactor: number };
export type Output = { readonly converted: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recorded: { type: "number" },
    unitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["recorded", "unitFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { converted: { type: "number" } },
  required: ["converted"],
} as const;
/** Apply an explicit compatible exposure-measurement unit factor without risk assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recorded, unitFactor } = request;
  const compute = (): Output => {
    H.positive(unitFactor);
    return { converted: recorded * unitFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recorded: 2, unitFactor: 1000 },
  output: { converted: 2000 },
} satisfies ToolExample<Input, Output>;
export const householdExposureUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-health/household-exposure-unit-factor",
    title: "Household Exposure Unit Factor Tool",
    description:
      "Apply an explicit compatible exposure-measurement unit factor without risk assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recorded: { type: "number" },
        unitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["recorded", "unitFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { converted: { type: "number" } },
      required: ["converted"],
    },
    ports: {
      inputs: [
        {
          id: "recorded",
          label: "Recorded",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitFactor",
          label: "Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "converted", label: "Converted", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = householdExposureUnitFactorTool.execute;
export default householdExposureUnitFactorTool;
