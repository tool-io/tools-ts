import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startingPackageContent: number;
  readonly removedContent: number;
};
export type Output = { readonly remainingContent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startingPackageContent: { type: "number", minimum: 0 },
    removedContent: { type: "number", minimum: 0 },
  },
  required: ["startingPackageContent", "removedContent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingContent: { type: "number" } },
  required: ["remainingContent"],
} as const;
/** Subtract explicitly removed content from package starting mass, preserving reconciliation discrepancies without dosing advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startingPackageContent, removedContent } = request;
  const compute = (): Output => {
    H.domain(startingPackageContent >= 0, "startingPackageContent");
    H.domain(removedContent >= 0, "removedContent");
    return { remainingContent: startingPackageContent - removedContent };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startingPackageContent: 100, removedContent: 35 },
  output: { remainingContent: 65 },
} satisfies ToolExample<Input, Output>;
export const topicalProductPackageRemainingMassTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dermatology/topical-product-package-remaining-mass",
    title: "Topical Product Package Remaining Mass Tool",
    description:
      "Subtract explicitly removed content from package starting mass, preserving reconciliation discrepancies without dosing advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startingPackageContent: { type: "number", minimum: 0 },
        removedContent: { type: "number", minimum: 0 },
      },
      required: ["startingPackageContent", "removedContent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingContent: { type: "number" } },
      required: ["remainingContent"],
    },
    ports: {
      inputs: [
        {
          id: "startingPackageContent",
          label: "Starting Package Content",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "removedContent",
          label: "Removed Content",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingContent",
          label: "Remaining Content",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = topicalProductPackageRemainingMassTool.execute;
export default topicalProductPackageRemainingMassTool;
