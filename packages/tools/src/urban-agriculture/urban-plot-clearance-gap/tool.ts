import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plotWidth: number;
  readonly bedWidths: readonly number[];
  readonly aisleWidths: readonly number[];
  readonly requiredEdgeClearance: number;
};
export type Output = {
  readonly occupiedWidth: number;
  readonly remainingWidth: number;
  readonly edgeMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plotWidth: { type: "number", minimum: 0 },
    bedWidths: { type: "array", maxItems: 256, items: { type: "number" } },
    aisleWidths: { type: "array", maxItems: 256, items: { type: "number" } },
    requiredEdgeClearance: { type: "number", minimum: 0 },
  },
  required: ["plotWidth", "bedWidths", "aisleWidths", "requiredEdgeClearance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occupiedWidth: { type: "number" },
    remainingWidth: { type: "number" },
    edgeMargin: { type: "number" },
  },
  required: ["occupiedWidth", "remainingWidth", "edgeMargin"],
} as const;
/** Calculate urban plot clearance gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plotWidth, bedWidths, aisleWidths, requiredEdgeClearance } = request;
  const compute = (): Output => {
    H.domain(
      plotWidth >= 0 &&
        [...bedWidths, ...aisleWidths].every((x) => x >= 0) &&
        requiredEdgeClearance >= 0,
    );
    return (() => {
      const occupiedWidth =
          bedWidths.reduce((a, b) => a + b, 0) +
          aisleWidths.reduce((a, b) => a + b, 0),
        remainingWidth = plotWidth - occupiedWidth;
      return {
        occupiedWidth,
        remainingWidth,
        edgeMargin: remainingWidth / 2 - requiredEdgeClearance,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    plotWidth: 20,
    bedWidths: [5, 5],
    aisleWidths: [2],
    requiredEdgeClearance: 3,
  },
  output: { occupiedWidth: 12, remainingWidth: 8, edgeMargin: 1 },
} satisfies ToolExample<Input, Output>;
export const urbanPlotClearanceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/urban-plot-clearance-gap",
    title: "Urban Plot Clearance Gap Tool",
    description:
      "Calculate urban plot clearance gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plotWidth: { type: "number", minimum: 0 },
        bedWidths: { type: "array", maxItems: 256, items: { type: "number" } },
        aisleWidths: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        requiredEdgeClearance: { type: "number", minimum: 0 },
      },
      required: [
        "plotWidth",
        "bedWidths",
        "aisleWidths",
        "requiredEdgeClearance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occupiedWidth: { type: "number" },
        remainingWidth: { type: "number" },
        edgeMargin: { type: "number" },
      },
      required: ["occupiedWidth", "remainingWidth", "edgeMargin"],
    },
    ports: {
      inputs: [
        {
          id: "plotWidth",
          label: "Plot Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bedWidths",
          label: "Bed Widths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "aisleWidths",
          label: "Aisle Widths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "requiredEdgeClearance",
          label: "Required Edge Clearance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "occupiedWidth",
          label: "Occupied Width",
          valueType: { type: "number" },
        },
        {
          id: "remainingWidth",
          label: "Remaining Width",
          valueType: { type: "number" },
        },
        {
          id: "edgeMargin",
          label: "Edge Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = urbanPlotClearanceGapTool.execute;
export default urbanPlotClearanceGapTool;
