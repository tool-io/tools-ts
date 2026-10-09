import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly distance: number; readonly inputUnit: string };
export type Output = { readonly kilometers: number; readonly miles: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    inputUnit: { type: "string", maxLength: 8192, enum: ["km", "mi"] },
  },
  required: ["distance", "inputUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { kilometers: { type: "number" }, miles: { type: "number" } },
  required: ["kilometers", "miles"],
} as const;
/** Convert an explicitly supplied provider distance between kilometers and international miles without estimating routes or network adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, inputUnit } = request;
  const compute = (): Output => {
    H.domain(distance >= 0, "distance");
    H.domain(["km", "mi"].includes(inputUnit), "inputUnit");
    return {
      kilometers: inputUnit === "mi" ? distance * 1.609344 : distance,
      miles: inputUnit === "km" ? distance / 1.609344 : distance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 10, inputUnit: "mi" },
  output: { kilometers: 16.09344, miles: 10 },
} satisfies ToolExample<Input, Output>;
export const providerNetworkDistanceUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["health-policy", "health policy", "social sciences"],
      keywords: ["health policy", "social sciences"],
    },
    id: "health-policy/provider-network-distance-unit",
    title: "Provider Network Distance Unit",
    description:
      "Convert an explicitly supplied provider distance between kilometers and international miles without estimating routes or network adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number", minimum: 0 },
        inputUnit: { type: "string", maxLength: 8192, enum: ["km", "mi"] },
      },
      required: ["distance", "inputUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { kilometers: { type: "number" }, miles: { type: "number" } },
      required: ["kilometers", "miles"],
    },
    ports: {
      inputs: [
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputUnit",
          label: "Input Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "kilometers",
          label: "Kilometers",
          valueType: { type: "number" },
        },
        { id: "miles", label: "Miles", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = providerNetworkDistanceUnitTool.execute;
export default providerNetworkDistanceUnitTool;
