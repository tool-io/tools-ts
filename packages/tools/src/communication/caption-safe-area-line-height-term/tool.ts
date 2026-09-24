import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frameHeight: number;
  readonly safeFraction: number;
  readonly lineHeight: number;
  readonly lines: number;
};
export type Output = {
  readonly safeHeight: number;
  readonly usedHeight: number;
  readonly remaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameHeight: { type: "number", minimum: 0 },
    safeFraction: { type: "number", minimum: 0, maximum: 1 },
    lineHeight: { type: "number", minimum: 0 },
    lines: { type: "integer", minimum: 0 },
  },
  required: ["frameHeight", "safeFraction", "lineHeight", "lines"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    safeHeight: { type: "number" },
    usedHeight: { type: "number" },
    remaining: { type: "number" },
  },
  required: ["safeHeight", "usedHeight", "remaining"],
} as const;
/** Calculate caption safe area line height term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frameHeight, safeFraction, lineHeight, lines } = request;
  const compute = (): Output => {
    H.domain(frameHeight >= 0 && lineHeight >= 0);
    H.probability(safeFraction);
    H.integer(lines, 0);
    return {
      safeHeight: frameHeight * safeFraction,
      usedHeight: lines * lineHeight,
      remaining: frameHeight * safeFraction - lines * lineHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frameHeight: 1080, safeFraction: 0.8, lineHeight: 48, lines: 2 },
  output: { safeHeight: 864, usedHeight: 96, remaining: 768 },
} satisfies ToolExample<Input, Output>;
export const captionSafeAreaLineHeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/caption-safe-area-line-height-term",
    title: "Caption Safe Area Line Height Term Tool",
    description:
      "Calculate caption safe area line height term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frameHeight: { type: "number", minimum: 0 },
        safeFraction: { type: "number", minimum: 0, maximum: 1 },
        lineHeight: { type: "number", minimum: 0 },
        lines: { type: "integer", minimum: 0 },
      },
      required: ["frameHeight", "safeFraction", "lineHeight", "lines"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        safeHeight: { type: "number" },
        usedHeight: { type: "number" },
        remaining: { type: "number" },
      },
      required: ["safeHeight", "usedHeight", "remaining"],
    },
    ports: {
      inputs: [
        {
          id: "frameHeight",
          label: "Frame Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "safeFraction",
          label: "Safe Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lineHeight",
          label: "Line Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lines",
          label: "Lines",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "safeHeight",
          label: "Safe Height",
          valueType: { type: "number" },
        },
        {
          id: "usedHeight",
          label: "Used Height",
          valueType: { type: "number" },
        },
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = captionSafeAreaLineHeightTermTool.execute;
export default captionSafeAreaLineHeightTermTool;
