import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossArea: number;
  readonly excludedAreas: readonly number[];
  readonly overlapCorrection: number;
};
export type Output = { readonly effectiveArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossArea: { type: "number", minimum: 0 },
    excludedAreas: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    overlapCorrection: { type: "number", minimum: 0 },
  },
  required: ["grossArea", "excludedAreas", "overlapCorrection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { effectiveArea: { type: "number" } },
  required: ["effectiveArea"],
} as const;
/** Subtract explicitly supplied exclusion areas with a caller-verified overlap correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossArea, excludedAreas, overlapCorrection } = request;
  const compute = (): Output => {
    H.domain(
      grossArea >= 0 &&
        excludedAreas.every((x) => x >= 0) &&
        overlapCorrection >= 0 &&
        overlapCorrection <= excludedAreas.reduce((a, b) => a + b, 0) &&
        grossArea -
          excludedAreas.reduce((a, b) => a + b, 0) +
          overlapCorrection >=
          0,
    );
    return {
      effectiveArea:
        grossArea -
        excludedAreas.reduce((a, b) => a + b, 0) +
        overlapCorrection,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossArea: 100, excludedAreas: [10, 20], overlapCorrection: 5 },
  output: { effectiveArea: 75 },
} satisfies ToolExample<Input, Output>;
export const ecologicalPlotEffectiveAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/ecological-plot-effective-area",
    title: "Ecological Plot Effective Area Tool",
    description:
      "Subtract explicitly supplied exclusion areas with a caller-verified overlap correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossArea: { type: "number", minimum: 0 },
        excludedAreas: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        overlapCorrection: { type: "number", minimum: 0 },
      },
      required: ["grossArea", "excludedAreas", "overlapCorrection"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { effectiveArea: { type: "number" } },
      required: ["effectiveArea"],
    },
    ports: {
      inputs: [
        {
          id: "grossArea",
          label: "Gross Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedAreas",
          label: "Excluded Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "overlapCorrection",
          label: "Overlap Correction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveArea",
          label: "Effective Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ecologicalPlotEffectiveAreaTool.execute;
export default ecologicalPlotEffectiveAreaTool;
