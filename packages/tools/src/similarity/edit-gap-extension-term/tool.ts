import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gapLength: number;
  readonly openingCost: number;
  readonly extensionCost: number;
};
export type Output = { readonly cost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gapLength: { type: "integer", minimum: 0 },
    openingCost: { type: "number", minimum: 0 },
    extensionCost: { type: "number", minimum: 0 },
  },
  required: ["gapLength", "openingCost", "extensionCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cost: { type: "number" } },
  required: ["cost"],
} as const;
/** Evaluate one affine gap cost using opening+(length−1)*extension and zero cost for an empty gap. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gapLength, openingCost, extensionCost } = request;
  const compute = (): Output => {
    H.integer(gapLength, 0);
    H.domain(openingCost >= 0 && extensionCost >= 0);
    return {
      cost: gapLength === 0 ? 0 : openingCost + (gapLength - 1) * extensionCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gapLength: 4, openingCost: 5, extensionCost: 2 },
  output: { cost: 11 },
} satisfies ToolExample<Input, Output>;
export const editGapExtensionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/edit-gap-extension-term",
    title: "Edit Gap Extension Term Tool",
    description:
      "Evaluate one affine gap cost using opening+(length−1)*extension and zero cost for an empty gap.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapLength: { type: "integer", minimum: 0 },
        openingCost: { type: "number", minimum: 0 },
        extensionCost: { type: "number", minimum: 0 },
      },
      required: ["gapLength", "openingCost", "extensionCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { cost: { type: "number" } },
      required: ["cost"],
    },
    ports: {
      inputs: [
        {
          id: "gapLength",
          label: "Gap Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "openingCost",
          label: "Opening Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extensionCost",
          label: "Extension Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "cost", label: "Cost", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = editGapExtensionTermTool.execute;
export default editGapExtensionTermTool;
