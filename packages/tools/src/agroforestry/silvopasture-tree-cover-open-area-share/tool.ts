import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalArea: number;
  readonly treeArea: number;
  readonly otherExcluded: number;
  readonly sharedExcluded: number;
};
export type Output = {
  readonly openArea: number;
  readonly openFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalArea: { type: "number", exclusiveMinimum: 0 },
    treeArea: { type: "number", minimum: 0 },
    otherExcluded: { type: "number", minimum: 0 },
    sharedExcluded: { type: "number", minimum: 0 },
  },
  required: ["totalArea", "treeArea", "otherExcluded", "sharedExcluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openArea: { type: "number" },
    openFraction: { type: "number" },
  },
  required: ["openArea", "openFraction"],
} as const;
/** Open-area fraction from explicit exclusion overlaps, without stocking guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalArea, treeArea, otherExcluded, sharedExcluded } = request;
  const compute = (): Output => {
    H.positive(totalArea);
    H.domain(
      treeArea >= 0 &&
        otherExcluded >= 0 &&
        sharedExcluded >= 0 &&
        sharedExcluded <= Math.min(treeArea, otherExcluded) &&
        treeArea + otherExcluded - sharedExcluded <= totalArea,
    );
    return {
      openArea: totalArea - treeArea - otherExcluded + sharedExcluded,
      openFraction:
        (totalArea - treeArea - otherExcluded + sharedExcluded) / totalArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalArea: 100, treeArea: 30, otherExcluded: 20, sharedExcluded: 5 },
  output: { openArea: 55, openFraction: 0.55 },
} satisfies ToolExample<Input, Output>;
export const silvopastureTreeCoverOpenAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/silvopasture-tree-cover-open-area-share",
    title: "Silvopasture Tree Cover Open Area Share Tool",
    description:
      "Open-area fraction from explicit exclusion overlaps, without stocking guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalArea: { type: "number", exclusiveMinimum: 0 },
        treeArea: { type: "number", minimum: 0 },
        otherExcluded: { type: "number", minimum: 0 },
        sharedExcluded: { type: "number", minimum: 0 },
      },
      required: ["totalArea", "treeArea", "otherExcluded", "sharedExcluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openArea: { type: "number" },
        openFraction: { type: "number" },
      },
      required: ["openArea", "openFraction"],
    },
    ports: {
      inputs: [
        {
          id: "totalArea",
          label: "Total Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "treeArea",
          label: "Tree Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherExcluded",
          label: "Other Excluded",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedExcluded",
          label: "Shared Excluded",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "openArea", label: "Open Area", valueType: { type: "number" } },
        {
          id: "openFraction",
          label: "Open Fraction",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = silvopastureTreeCoverOpenAreaShareTool.execute;
export default silvopastureTreeCoverOpenAreaShareTool;
