import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly positions: readonly number[];
  readonly heights: readonly number[];
  readonly referenceSlope: number;
  readonly referenceIntercept: number;
};
export type Output = {
  readonly residuals: readonly number[];
  readonly rms: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positions: { type: "array", maxItems: 256, items: { type: "number" } },
    heights: { type: "array", maxItems: 256, items: { type: "number" } },
    referenceSlope: { type: "number" },
    referenceIntercept: { type: "number" },
  },
  required: ["positions", "heights", "referenceSlope", "referenceIntercept"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residuals: { type: "array", maxItems: 256, items: { type: "number" } },
    rms: { type: "number" },
  },
  required: ["residuals", "rms"],
} as const;
/** RMS profile height about an explicitly supplied reference line. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { positions, heights, referenceSlope, referenceIntercept } = request;
  const compute = (): Output => {
    H.sameLength(positions, heights);
    H.domain(heights.length > 0);
    const residuals = heights.map(
        (x, i) => x - referenceIntercept - referenceSlope * positions[i],
      ),
      scale = Math.max(...residuals.map(Math.abs));
    return {
      residuals,
      rms:
        scale === 0
          ? 0
          : (scale * Math.hypot(...residuals.map((x) => x / scale))) /
            Math.sqrt(residuals.length),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    positions: [0, 1, 2],
    heights: [1, 3, 3],
    referenceSlope: 1,
    referenceIntercept: 1,
  },
  output: { residuals: [0, 1, 0], rms: 0.5773502691896258 },
} satisfies ToolExample<Input, Output>;
export const soilSurfaceRoughnessOneProfileTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/soil-surface-roughness-one-profile-term",
    title: "Soil Surface Roughness One Profile Term Tool",
    description:
      "RMS profile height about an explicitly supplied reference line.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positions: { type: "array", maxItems: 256, items: { type: "number" } },
        heights: { type: "array", maxItems: 256, items: { type: "number" } },
        referenceSlope: { type: "number" },
        referenceIntercept: { type: "number" },
      },
      required: [
        "positions",
        "heights",
        "referenceSlope",
        "referenceIntercept",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        residuals: { type: "array", maxItems: 256, items: { type: "number" } },
        rms: { type: "number" },
      },
      required: ["residuals", "rms"],
    },
    ports: {
      inputs: [
        {
          id: "positions",
          label: "Positions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "heights",
          label: "Heights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referenceSlope",
          label: "Reference Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceIntercept",
          label: "Reference Intercept",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "residuals",
          label: "Residuals",
          valueType: { type: "list", items: { type: "number" } },
        },
        { id: "rms", label: "Rms", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = soilSurfaceRoughnessOneProfileTermTool.execute;
export default soilSurfaceRoughnessOneProfileTermTool;
