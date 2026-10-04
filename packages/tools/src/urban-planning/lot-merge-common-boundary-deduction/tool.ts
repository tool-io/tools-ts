import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly perimeters: readonly number[];
  readonly sharedBoundaryLength: number;
};
export type Output = { readonly mergedPerimeter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perimeters: { type: "array", maxItems: 256, items: { type: "number" } },
    sharedBoundaryLength: { type: "number", minimum: 0 },
  },
  required: ["perimeters", "sharedBoundaryLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mergedPerimeter: { type: "number" } },
  required: ["mergedPerimeter"],
} as const;
/** Remove both appearances of a supplied internal boundary from parcel perimeters. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { perimeters, sharedBoundaryLength } = request;
  const compute = (): Output => {
    H.domain(
      perimeters.every((x) => x >= 0) &&
        sharedBoundaryLength >= 0 &&
        2 * sharedBoundaryLength <= perimeters.reduce((a, b) => a + b, 0),
    );
    return {
      mergedPerimeter:
        perimeters.reduce((a, b) => a + b, 0) - 2 * sharedBoundaryLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { perimeters: [100, 80], sharedBoundaryLength: 20 },
  output: { mergedPerimeter: 140 },
} satisfies ToolExample<Input, Output>;
export const lotMergeCommonBoundaryDeductionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/lot-merge-common-boundary-deduction",
    title: "Lot Merge Common Boundary Deduction Tool",
    description:
      "Remove both appearances of a supplied internal boundary from parcel perimeters.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        perimeters: { type: "array", maxItems: 256, items: { type: "number" } },
        sharedBoundaryLength: { type: "number", minimum: 0 },
      },
      required: ["perimeters", "sharedBoundaryLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { mergedPerimeter: { type: "number" } },
      required: ["mergedPerimeter"],
    },
    ports: {
      inputs: [
        {
          id: "perimeters",
          label: "Perimeters",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sharedBoundaryLength",
          label: "Shared Boundary Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "mergedPerimeter",
          label: "Merged Perimeter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lotMergeCommonBoundaryDeductionTool.execute;
export default lotMergeCommonBoundaryDeductionTool;
