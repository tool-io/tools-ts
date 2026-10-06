import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly idlingFuelVolume: number;
  readonly totalFuelVolume: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    idlingFuelVolume: { type: "number", minimum: 0 },
    totalFuelVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["idlingFuelVolume", "totalFuelVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate the share of explicit total fuel attributed to idling on compatible volume units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { idlingFuelVolume, totalFuelVolume } = request;
  const compute = (): Output => {
    (H.domain(totalFuelVolume > 0, "totalFuelVolume"), totalFuelVolume);
    H.domain(
      idlingFuelVolume >= 0 && idlingFuelVolume <= totalFuelVolume,
      "idlingFuelVolume",
    );
    return {
      fraction: idlingFuelVolume / totalFuelVolume,
      remainder: totalFuelVolume - idlingFuelVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { idlingFuelVolume: 30, totalFuelVolume: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const machineryIdlingFuelShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrotechnology", "agriculture"],
      keywords: ["agrotechnology", "agriculture"],
    },
    id: "agrotechnology/machinery-idling-fuel-share",
    title: "Machinery Idling Fuel Share",
    description:
      "Calculate the share of explicit total fuel attributed to idling on compatible volume units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        idlingFuelVolume: { type: "number", minimum: 0 },
        totalFuelVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["idlingFuelVolume", "totalFuelVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "idlingFuelVolume",
          label: "Idling Fuel Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalFuelVolume",
          label: "Total Fuel Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = machineryIdlingFuelShareTool.execute;
export default machineryIdlingFuelShareTool;
