import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dimensions: readonly number[];
  readonly expectedAxes: number;
};
export type Output = {
  readonly complete: boolean;
  readonly missingAxes: number;
  readonly extraAxes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dimensions: { type: "array", maxItems: 256, items: { type: "number" } },
    expectedAxes: { type: "integer", minimum: 1 },
  },
  required: ["dimensions", "expectedAxes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    complete: { type: "boolean" },
    missingAxes: { type: "integer" },
    extraAxes: { type: "integer" },
  },
  required: ["complete", "missingAxes", "extraAxes"],
} as const;
/** Check recorded measurement-axis count only; no tissue adequacy or diagnosis is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dimensions, expectedAxes } = request;
  const compute = (): Output => {
    H.integer(expectedAxes, 1);
    H.domain(dimensions.every((x) => x >= 0));
    return {
      complete: dimensions.length === expectedAxes,
      missingAxes: Math.max(0, expectedAxes - dimensions.length),
      extraAxes: Math.max(0, dimensions.length - expectedAxes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dimensions: [2, 3], expectedAxes: 3 },
  output: { complete: false, missingAxes: 1, extraAxes: 0 },
} satisfies ToolExample<Input, Output>;
export const biopsyDimensionClosureFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pathology/biopsy-dimension-closure-flag",
    title: "Biopsy Dimension Closure Flag Tool",
    description:
      "Check recorded measurement-axis count only; no tissue adequacy or diagnosis is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dimensions: { type: "array", maxItems: 256, items: { type: "number" } },
        expectedAxes: { type: "integer", minimum: 1 },
      },
      required: ["dimensions", "expectedAxes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        complete: { type: "boolean" },
        missingAxes: { type: "integer" },
        extraAxes: { type: "integer" },
      },
      required: ["complete", "missingAxes", "extraAxes"],
    },
    ports: {
      inputs: [
        {
          id: "dimensions",
          label: "Dimensions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "expectedAxes",
          label: "Expected Axes",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "complete", label: "Complete", valueType: { type: "boolean" } },
        {
          id: "missingAxes",
          label: "Missing Axes",
          valueType: { type: "integer" },
        },
        {
          id: "extraAxes",
          label: "Extra Axes",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = biopsyDimensionClosureFlagTool.execute;
export default biopsyDimensionClosureFlagTool;
