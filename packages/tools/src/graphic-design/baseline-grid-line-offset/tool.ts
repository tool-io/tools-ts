import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly origin: number;
  readonly lineIndex: number;
  readonly gridSpacing: number;
};
export type Output = { readonly baselinePosition: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    origin: { type: "number" },
    lineIndex: { type: "integer" },
    gridSpacing: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["origin", "lineIndex", "gridSpacing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { baselinePosition: { type: "number" } },
  required: ["baselinePosition"],
} as const;
/** Locate an explicitly indexed baseline on a uniformly spaced design grid with a signed origin. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { origin, lineIndex, gridSpacing } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(lineIndex) &&
        lineIndex >= -Number.MAX_SAFE_INTEGER &&
        lineIndex <= Number.MAX_SAFE_INTEGER,
      "lineIndex",
    ),
      lineIndex);
    (H.domain(gridSpacing > 0, "gridSpacing"), gridSpacing);
    return { baselinePosition: origin + lineIndex * gridSpacing };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { origin: 10, lineIndex: 3, gridSpacing: 12 },
  output: { baselinePosition: 46 },
} satisfies ToolExample<Input, Output>;
export const baselineGridLineOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["graphic-design", "graphic design", "arts and design"],
      keywords: ["graphic design", "arts and design"],
    },
    id: "graphic-design/baseline-grid-line-offset",
    title: "Baseline Grid Line Offset",
    description:
      "Locate an explicitly indexed baseline on a uniformly spaced design grid with a signed origin.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        origin: { type: "number" },
        lineIndex: { type: "integer" },
        gridSpacing: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["origin", "lineIndex", "gridSpacing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { baselinePosition: { type: "number" } },
      required: ["baselinePosition"],
    },
    ports: {
      inputs: [
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lineIndex",
          label: "Line Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "gridSpacing",
          label: "Grid Spacing",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "baselinePosition",
          label: "Baseline Position",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = baselineGridLineOffsetTool.execute;
export default baselineGridLineOffsetTool;
