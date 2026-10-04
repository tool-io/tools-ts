import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossArea: number;
  readonly excludedAreas: readonly number[];
  readonly reportedUsable: number;
};
export type Output = {
  readonly calculatedUsable: number;
  readonly residual: number;
};
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
    reportedUsable: { type: "number", minimum: 0 },
  },
  required: ["grossArea", "excludedAreas", "reportedUsable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calculatedUsable: { type: "number" },
    residual: { type: "number" },
  },
  required: ["calculatedUsable", "residual"],
} as const;
/** Audit explicitly disjoint excluded plot areas without parcel or access-right inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossArea, excludedAreas, reportedUsable } = request;
  const compute = (): Output => {
    H.domain(
      grossArea >= 0 &&
        reportedUsable >= 0 &&
        excludedAreas.every((x) => x >= 0) &&
        excludedAreas.reduce((a, b) => a + b, 0) <= grossArea,
    );
    return {
      calculatedUsable: grossArea - excludedAreas.reduce((a, b) => a + b, 0),
      residual:
        reportedUsable - grossArea + excludedAreas.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossArea: 100, excludedAreas: [10, 20], reportedUsable: 65 },
  output: { calculatedUsable: 70, residual: -5 },
} satisfies ToolExample<Input, Output>;
export const urbanPlotUsableAreaGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/urban-plot-usable-area-gap",
    title: "Urban Plot Usable Area Gap Tool",
    description:
      "Audit explicitly disjoint excluded plot areas without parcel or access-right inference.",
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
        reportedUsable: { type: "number", minimum: 0 },
      },
      required: ["grossArea", "excludedAreas", "reportedUsable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calculatedUsable: { type: "number" },
        residual: { type: "number" },
      },
      required: ["calculatedUsable", "residual"],
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
          id: "reportedUsable",
          label: "Reported Usable",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "calculatedUsable",
          label: "Calculated Usable",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = urbanPlotUsableAreaGapTool.execute;
export default urbanPlotUsableAreaGapTool;
