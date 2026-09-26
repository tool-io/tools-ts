import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly privateCost: number;
  readonly externalCost: number;
};
export type Output = { readonly socialCost: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    privateCost: { type: "number" },
    externalCost: { type: "number" },
  },
  required: ["privateCost", "externalCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { socialCost: { type: "number" }, gap: { type: "number" } },
  required: ["socialCost", "gap"],
} as const;
/** Calculate external cost private social gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { privateCost, externalCost } = request;
  const compute = (): Output => {
    return { socialCost: privateCost + externalCost, gap: externalCost };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { privateCost: 20, externalCost: 5 },
  output: { socialCost: 25, gap: 5 },
} satisfies ToolExample<Input, Output>;
export const externalCostPrivateSocialGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/external-cost-private-social-gap",
    title: "External Cost Private Social Gap Tool",
    description:
      "Calculate external cost private social gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        privateCost: { type: "number" },
        externalCost: { type: "number" },
      },
      required: ["privateCost", "externalCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { socialCost: { type: "number" }, gap: { type: "number" } },
      required: ["socialCost", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "privateCost",
          label: "Private Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "externalCost",
          label: "External Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "socialCost",
          label: "Social Cost",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = externalCostPrivateSocialGapTool.execute;
export default externalCostPrivateSocialGapTool;
