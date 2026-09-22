import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly range: number;
  readonly solidAngleSteradians: number;
  readonly gateDepth: number;
};
export type Output = { readonly approximateVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    range: { type: "number", minimum: 0 },
    solidAngleSteradians: { type: "number", minimum: 0 },
    gateDepth: { type: "number", minimum: 0 },
  },
  required: ["range", "solidAngleSteradians", "gateDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { approximateVolume: { type: "number" } },
  required: ["approximateVolume"],
} as const;
/** Approximate a thin radar gate volume by r²*solidAngle*depth, not a thick-shell exact volume. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { range, solidAngleSteradians, gateDepth } = request;
  const compute = (): Output => {
    H.domain(
      range >= 0 &&
        solidAngleSteradians >= 0 &&
        solidAngleSteradians <= 4 * Math.PI &&
        gateDepth >= 0,
    );
    return { approximateVolume: range ** 2 * solidAngleSteradians * gateDepth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { range: 100, solidAngleSteradians: 0.01, gateDepth: 10 },
  output: { approximateVolume: 1000 },
} satisfies ToolExample<Input, Output>;
export const radarRangeGateVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/radar-range-gate-volume-term",
    title: "Radar Range Gate Volume Term Tool",
    description:
      "Approximate a thin radar gate volume by r²*solidAngle*depth, not a thick-shell exact volume.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        range: { type: "number", minimum: 0 },
        solidAngleSteradians: { type: "number", minimum: 0 },
        gateDepth: { type: "number", minimum: 0 },
      },
      required: ["range", "solidAngleSteradians", "gateDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { approximateVolume: { type: "number" } },
      required: ["approximateVolume"],
    },
    ports: {
      inputs: [
        {
          id: "range",
          label: "Range",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "solidAngleSteradians",
          label: "Solid Angle Steradians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gateDepth",
          label: "Gate Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "approximateVolume",
          label: "Approximate Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = radarRangeGateVolumeTermTool.execute;
export default radarRangeGateVolumeTermTool;
