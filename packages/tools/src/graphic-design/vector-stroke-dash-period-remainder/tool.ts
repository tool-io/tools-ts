import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dashArray: readonly number[];
  readonly offset: number;
};
export type Output = {
  readonly effectiveDashArray: readonly number[];
  readonly period: number;
  readonly normalizedOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dashArray: { type: "array", maxItems: 256, items: { type: "number" } },
    offset: { type: "number" },
  },
  required: ["dashArray", "offset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveDashArray: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    period: { type: "number" },
    normalizedOffset: { type: "number" },
  },
  required: ["effectiveDashArray", "period", "normalizedOffset"],
} as const;
/** SVG-style dash-array odd-list duplication and signed offset wrapping for a nonempty pattern with strictly positive total length. All-zero solid-stroke patterns have no wrapping period and are rejected; no path flattening or raster rendering. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dashArray, offset } = request;
  const compute = (): Output => {
    H.domain(
      dashArray.length > 0 &&
        dashArray.length <= 128 &&
        dashArray.every((x) => x >= 0),
    );
    const effectiveDashArray =
        dashArray.length % 2 ? [...dashArray, ...dashArray] : [...dashArray],
      period = effectiveDashArray.reduce((a, b) => a + b, 0);
    H.positive(period);
    const r = offset % period;
    return {
      effectiveDashArray,
      period,
      normalizedOffset: r < 0 ? r + period : r,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dashArray: [3, 2, 1], offset: -1 },
  output: {
    effectiveDashArray: [3, 2, 1, 3, 2, 1],
    period: 12,
    normalizedOffset: 11,
  },
} satisfies ToolExample<Input, Output>;
export const vectorStrokeDashPeriodRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/vector-stroke-dash-period-remainder",
    title: "Vector Stroke Dash Period Remainder Tool",
    description:
      "SVG-style dash-array odd-list duplication and signed offset wrapping for a nonempty pattern with strictly positive total length. All-zero solid-stroke patterns have no wrapping period and are rejected; no path flattening or raster rendering.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dashArray: { type: "array", maxItems: 256, items: { type: "number" } },
        offset: { type: "number" },
      },
      required: ["dashArray", "offset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveDashArray: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        period: { type: "number" },
        normalizedOffset: { type: "number" },
      },
      required: ["effectiveDashArray", "period", "normalizedOffset"],
    },
    ports: {
      inputs: [
        {
          id: "dashArray",
          label: "Dash Array",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveDashArray",
          label: "Effective Dash Array",
          valueType: { type: "list", items: { type: "number" } },
        },
        { id: "period", label: "Period", valueType: { type: "number" } },
        {
          id: "normalizedOffset",
          label: "Normalized Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = vectorStrokeDashPeriodRemainderTool.execute;
export default vectorStrokeDashPeriodRemainderTool;
