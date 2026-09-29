import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalArea: number;
  readonly foldArea: number;
  readonly tearArea: number;
  readonly sharedExcludedArea: number;
};
export type Output = {
  readonly excludedUnion: number;
  readonly usableArea: number;
  readonly usableFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalArea: { type: "number", exclusiveMinimum: 0 },
    foldArea: { type: "number", minimum: 0 },
    tearArea: { type: "number", minimum: 0 },
    sharedExcludedArea: { type: "number", minimum: 0 },
  },
  required: ["totalArea", "foldArea", "tearArea", "sharedExcludedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    excludedUnion: { type: "number" },
    usableArea: { type: "number" },
    usableFraction: { type: "number" },
  },
  required: ["excludedUnion", "usableArea", "usableFraction"],
} as const;
/** Calculate section fold excluded area share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalArea, foldArea, tearArea, sharedExcludedArea } = request;
  const compute = (): Output => {
    H.positive(totalArea);
    H.domain(
      foldArea >= 0 &&
        tearArea >= 0 &&
        sharedExcludedArea >= 0 &&
        sharedExcludedArea <= Math.min(foldArea, tearArea) &&
        foldArea + tearArea - sharedExcludedArea <= totalArea,
    );
    return {
      excludedUnion: foldArea + tearArea - sharedExcludedArea,
      usableArea: totalArea - foldArea - tearArea + sharedExcludedArea,
      usableFraction:
        (totalArea - foldArea - tearArea + sharedExcludedArea) / totalArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalArea: 100, foldArea: 10, tearArea: 8, sharedExcludedArea: 3 },
  output: { excludedUnion: 15, usableArea: 85, usableFraction: 0.85 },
} satisfies ToolExample<Input, Output>;
export const sectionFoldExcludedAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/section-fold-excluded-area-share",
    title: "Section Fold Excluded Area Share Tool",
    description:
      "Calculate section fold excluded area share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalArea: { type: "number", exclusiveMinimum: 0 },
        foldArea: { type: "number", minimum: 0 },
        tearArea: { type: "number", minimum: 0 },
        sharedExcludedArea: { type: "number", minimum: 0 },
      },
      required: ["totalArea", "foldArea", "tearArea", "sharedExcludedArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        excludedUnion: { type: "number" },
        usableArea: { type: "number" },
        usableFraction: { type: "number" },
      },
      required: ["excludedUnion", "usableArea", "usableFraction"],
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
          id: "foldArea",
          label: "Fold Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tearArea",
          label: "Tear Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedExcludedArea",
          label: "Shared Excluded Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "excludedUnion",
          label: "Excluded Union",
          valueType: { type: "number" },
        },
        {
          id: "usableArea",
          label: "Usable Area",
          valueType: { type: "number" },
        },
        {
          id: "usableFraction",
          label: "Usable Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sectionFoldExcludedAreaShareTool.execute;
export default sectionFoldExcludedAreaShareTool;
