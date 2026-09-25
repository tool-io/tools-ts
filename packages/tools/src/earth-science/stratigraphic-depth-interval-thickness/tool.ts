import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly topDepth: number;
  readonly bottomDepth: number;
  readonly suppliedScale: number;
  readonly positiveDown: boolean;
};
export type Output = {
  readonly signedThickness: number;
  readonly absoluteThickness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topDepth: { type: "number" },
    bottomDepth: { type: "number" },
    suppliedScale: { type: "number", exclusiveMinimum: 0 },
    positiveDown: { type: "boolean" },
  },
  required: ["topDepth", "bottomDepth", "suppliedScale", "positiveDown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedThickness: { type: "number" },
    absoluteThickness: { type: "number" },
  },
  required: ["signedThickness", "absoluteThickness"],
} as const;
/** Compare supplied stratigraphic depth endpoints in a common datum without interpreting stratigraphic age or continuity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { topDepth, bottomDepth, suppliedScale, positiveDown } = request;
  const compute = (): Output => {
    H.positive(suppliedScale);
    return {
      signedThickness:
        (bottomDepth - topDepth) * suppliedScale * (positiveDown ? 1 : -1),
      absoluteThickness: Math.abs(bottomDepth - topDepth) * suppliedScale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    topDepth: 10,
    bottomDepth: 25,
    suppliedScale: 2,
    positiveDown: true,
  },
  output: { signedThickness: 30, absoluteThickness: 30 },
} satisfies ToolExample<Input, Output>;
export const stratigraphicDepthIntervalThicknessTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "earth-science/stratigraphic-depth-interval-thickness",
      title: "Stratigraphic Depth Interval Thickness Tool",
      description:
        "Compare supplied stratigraphic depth endpoints in a common datum without interpreting stratigraphic age or continuity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          topDepth: { type: "number" },
          bottomDepth: { type: "number" },
          suppliedScale: { type: "number", exclusiveMinimum: 0 },
          positiveDown: { type: "boolean" },
        },
        required: ["topDepth", "bottomDepth", "suppliedScale", "positiveDown"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signedThickness: { type: "number" },
          absoluteThickness: { type: "number" },
        },
        required: ["signedThickness", "absoluteThickness"],
      },
      ports: {
        inputs: [
          {
            id: "topDepth",
            label: "Top Depth",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "bottomDepth",
            label: "Bottom Depth",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedScale",
            label: "Supplied Scale",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "positiveDown",
            label: "Positive Down",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "signedThickness",
            label: "Signed Thickness",
            valueType: { type: "number" },
          },
          {
            id: "absoluteThickness",
            label: "Absolute Thickness",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = stratigraphicDepthIntervalThicknessTool.execute;
export default stratigraphicDepthIntervalThicknessTool;
