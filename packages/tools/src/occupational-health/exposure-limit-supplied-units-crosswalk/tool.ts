import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measured: number;
  readonly measuredUnit: string;
  readonly limit: number;
  readonly limitUnit: string;
  readonly conversionFactor: number;
};
export type Output = {
  readonly converted: number;
  readonly margin: number;
  readonly exceeds: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measured: { type: "number" },
    measuredUnit: { type: "string", maxLength: 8192 },
    limit: { type: "number" },
    limitUnit: { type: "string", maxLength: 8192 },
    conversionFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "measured",
    "measuredUnit",
    "limit",
    "limitUnit",
    "conversionFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    converted: { type: "number" },
    margin: { type: "number" },
    exceeds: { type: "boolean" },
  },
  required: ["converted", "margin", "exceeds"],
} as const;
/** Compare a measurement to an explicit limit after a supplied directed unit factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measured, measuredUnit, limit, limitUnit, conversionFactor } =
    request;
  const compute = (): Output => {
    H.domain(measuredUnit.length > 0 && limitUnit.length > 0, "measuredUnit");
    H.positive(conversionFactor);
    const converted = measured * conversionFactor;
    return { converted, margin: limit - converted, exceeds: converted > limit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measured: 2,
    measuredUnit: "mg/m3",
    limit: 1500,
    limitUnit: "ug/m3",
    conversionFactor: 1000,
  },
  output: { converted: 2000, margin: -500, exceeds: true },
} satisfies ToolExample<Input, Output>;
export const exposureLimitSuppliedUnitsCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "occupational-health/exposure-limit-supplied-units-crosswalk",
      title: "Exposure Limit Supplied Units Crosswalk Tool",
      description:
        "Compare a measurement to an explicit limit after a supplied directed unit factor.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measured: { type: "number" },
          measuredUnit: { type: "string", maxLength: 8192 },
          limit: { type: "number" },
          limitUnit: { type: "string", maxLength: 8192 },
          conversionFactor: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "measured",
          "measuredUnit",
          "limit",
          "limitUnit",
          "conversionFactor",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          converted: { type: "number" },
          margin: { type: "number" },
          exceeds: { type: "boolean" },
        },
        required: ["converted", "margin", "exceeds"],
      },
      ports: {
        inputs: [
          {
            id: "measured",
            label: "Measured",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "measuredUnit",
            label: "Measured Unit",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "limit",
            label: "Limit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "limitUnit",
            label: "Limit Unit",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "conversionFactor",
            label: "Conversion Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "converted",
            label: "Converted",
            valueType: { type: "number" },
          },
          { id: "margin", label: "Margin", valueType: { type: "number" } },
          { id: "exceeds", label: "Exceeds", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = exposureLimitSuppliedUnitsCrosswalkTool.execute;
export default exposureLimitSuppliedUnitsCrosswalkTool;
