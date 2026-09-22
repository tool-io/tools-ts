import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signal: number;
  readonly background: number;
  readonly range: number;
  readonly overlapFraction: number;
  readonly energy: number;
};
export type Output = {
  readonly netSignal: number;
  readonly correctedReturn: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signal: { type: "number" },
    background: { type: "number" },
    range: { type: "number", minimum: 0 },
    overlapFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    energy: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["signal", "background", "range", "overlapFraction", "energy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netSignal: { type: "number" },
    correctedReturn: { type: "number" },
  },
  required: ["netSignal", "correctedReturn"],
} as const;
/** Background-subtracted range-squared return normalized by explicit overlap and pulse energy; no aerosol inversion is performed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signal, background, range, overlapFraction, energy } = request;
  const compute = (): Output => {
    H.domain(range >= 0 && overlapFraction > 0 && overlapFraction <= 1);
    H.positive(energy);
    return {
      netSignal: signal - background,
      correctedReturn:
        ((signal - background) * range ** 2) / (overlapFraction * energy),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    signal: 10,
    background: 2,
    range: 5,
    overlapFraction: 0.5,
    energy: 2,
  },
  output: { netSignal: 8, correctedReturn: 200 },
} satisfies ToolExample<Input, Output>;
export const lidarOverlapNormalizedReturnTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/lidar-overlap-normalized-return-term",
    title: "Lidar Overlap Normalized Return Term Tool",
    description:
      "Background-subtracted range-squared return normalized by explicit overlap and pulse energy; no aerosol inversion is performed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signal: { type: "number" },
        background: { type: "number" },
        range: { type: "number", minimum: 0 },
        overlapFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        energy: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["signal", "background", "range", "overlapFraction", "energy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netSignal: { type: "number" },
        correctedReturn: { type: "number" },
      },
      required: ["netSignal", "correctedReturn"],
    },
    ports: {
      inputs: [
        {
          id: "signal",
          label: "Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "background",
          label: "Background",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "range",
          label: "Range",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapFraction",
          label: "Overlap Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "energy",
          label: "Energy",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netSignal", label: "Net Signal", valueType: { type: "number" } },
        {
          id: "correctedReturn",
          label: "Corrected Return",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lidarOverlapNormalizedReturnTermTool.execute;
export default lidarOverlapNormalizedReturnTermTool;
