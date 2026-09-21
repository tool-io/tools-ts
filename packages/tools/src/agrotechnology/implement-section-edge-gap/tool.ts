import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sectionWidths: readonly number[];
  readonly enabled: readonly boolean[];
  readonly targetWidth: number;
};
export type Output = {
  readonly enabledWidth: number;
  readonly edgeGap: number;
  readonly centeredGapEachSide: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sectionWidths: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    enabled: { type: "array", maxItems: 256, items: { type: "boolean" } },
    targetWidth: { type: "number", minimum: 0 },
  },
  required: ["sectionWidths", "enabled", "targetWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    enabledWidth: { type: "number" },
    edgeGap: { type: "number" },
    centeredGapEachSide: { type: "number" },
  },
  required: ["enabledWidth", "edgeGap", "centeredGapEachSide"],
} as const;
/** Calculate implement section edge gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sectionWidths, enabled, targetWidth } = request;
  const compute = (): Output => {
    H.sameLength(sectionWidths, enabled);
    H.domain(sectionWidths.every((x) => x >= 0) && targetWidth >= 0);
    return (() => {
      const enabledWidth = sectionWidths.reduce(
          (s, x, i) => s + (enabled[i] ? x : 0),
          0,
        ),
        edgeGap = targetWidth - enabledWidth;
      return { enabledWidth, edgeGap, centeredGapEachSide: edgeGap / 2 };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sectionWidths: [2, 3, 2],
    enabled: [true, true, false],
    targetWidth: 6,
  },
  output: { enabledWidth: 5, edgeGap: 1, centeredGapEachSide: 0.5 },
} satisfies ToolExample<Input, Output>;
export const implementSectionEdgeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/implement-section-edge-gap",
    title: "Implement Section Edge Gap Tool",
    description:
      "Calculate implement section edge gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sectionWidths: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        enabled: { type: "array", maxItems: 256, items: { type: "boolean" } },
        targetWidth: { type: "number", minimum: 0 },
      },
      required: ["sectionWidths", "enabled", "targetWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        enabledWidth: { type: "number" },
        edgeGap: { type: "number" },
        centeredGapEachSide: { type: "number" },
      },
      required: ["enabledWidth", "edgeGap", "centeredGapEachSide"],
    },
    ports: {
      inputs: [
        {
          id: "sectionWidths",
          label: "Section Widths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "enabled",
          label: "Enabled",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "targetWidth",
          label: "Target Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "enabledWidth",
          label: "Enabled Width",
          valueType: { type: "number" },
        },
        { id: "edgeGap", label: "Edge Gap", valueType: { type: "number" } },
        {
          id: "centeredGapEachSide",
          label: "Centered Gap Each Side",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = implementSectionEdgeGapTool.execute;
export default implementSectionEdgeGapTool;
