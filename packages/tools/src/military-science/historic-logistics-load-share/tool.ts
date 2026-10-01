import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly itemMass: number; readonly totalMass: number };
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemMass: { type: "number", minimum: 0 },
    totalMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["itemMass", "totalMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Compute a supplied historical archive load share without planning operational logistics. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemMass, totalMass } = request;
  const compute = (): Output => {
    H.positive(totalMass);
    H.domain(itemMass >= 0 && itemMass <= totalMass);
    return { share: itemMass / totalMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { itemMass: 3, totalMass: 12 },
  output: { share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const historicLogisticsLoadShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/historic-logistics-load-share",
    title: "Historic Logistics Load Share Tool",
    description:
      "Compute a supplied historical archive load share without planning operational logistics.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemMass: { type: "number", minimum: 0 },
        totalMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["itemMass", "totalMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "itemMass",
          label: "Item Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalMass",
          label: "Total Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = historicLogisticsLoadShareTool.execute;
export default historicLogisticsLoadShareTool;
