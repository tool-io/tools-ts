import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCoverage: number;
  readonly secondCoverage: number;
  readonly overlap: number;
  readonly overprint: boolean;
};
export type Output = {
  readonly combinedCoverage: number;
  readonly doubleInkCoverage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCoverage: { type: "number", minimum: 0, maximum: 1 },
    secondCoverage: { type: "number", minimum: 0, maximum: 1 },
    overlap: { type: "number" },
    overprint: { type: "boolean" },
  },
  required: ["firstCoverage", "secondCoverage", "overlap", "overprint"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    combinedCoverage: { type: "number" },
    doubleInkCoverage: { type: "number" },
  },
  required: ["combinedCoverage", "doubleInkCoverage"],
} as const;
/** Coverage bookkeeping with supplied overlap and overprint/knockout assumptions; no color or press behavior is predicted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCoverage, secondCoverage, overlap, overprint } = request;
  const compute = (): Output => {
    H.probability(firstCoverage);
    H.probability(secondCoverage);
    H.domain(
      overlap >= Math.max(0, firstCoverage + secondCoverage - 1) &&
        overlap <= Math.min(firstCoverage, secondCoverage),
    );
    return {
      combinedCoverage: overprint
        ? firstCoverage + secondCoverage
        : firstCoverage + secondCoverage - overlap,
      doubleInkCoverage: overprint ? overlap : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstCoverage: 0.5,
    secondCoverage: 0.4,
    overlap: 0.2,
    overprint: true,
  },
  output: { combinedCoverage: 0.9, doubleInkCoverage: 0.2 },
} satisfies ToolExample<Input, Output>;
export const inkChannelOverprintBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/ink-channel-overprint-base-flag",
    title: "Ink Channel Overprint Base Flag Tool",
    description:
      "Coverage bookkeeping with supplied overlap and overprint/knockout assumptions; no color or press behavior is predicted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCoverage: { type: "number", minimum: 0, maximum: 1 },
        secondCoverage: { type: "number", minimum: 0, maximum: 1 },
        overlap: { type: "number" },
        overprint: { type: "boolean" },
      },
      required: ["firstCoverage", "secondCoverage", "overlap", "overprint"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        combinedCoverage: { type: "number" },
        doubleInkCoverage: { type: "number" },
      },
      required: ["combinedCoverage", "doubleInkCoverage"],
    },
    ports: {
      inputs: [
        {
          id: "firstCoverage",
          label: "First Coverage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondCoverage",
          label: "Second Coverage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlap",
          label: "Overlap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overprint",
          label: "Overprint",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "combinedCoverage",
          label: "Combined Coverage",
          valueType: { type: "number" },
        },
        {
          id: "doubleInkCoverage",
          label: "Double Ink Coverage",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = inkChannelOverprintBaseFlagTool.execute;
export default inkChannelOverprintBaseFlagTool;
