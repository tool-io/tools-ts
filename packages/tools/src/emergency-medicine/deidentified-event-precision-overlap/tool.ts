import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTime: number;
  readonly firstHalfwidth: number;
  readonly secondTime: number;
  readonly secondHalfwidth: number;
};
export type Output = {
  readonly overlapWidth: number;
  readonly mayOverlap: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTime: { type: "number" },
    firstHalfwidth: { type: "number", minimum: 0 },
    secondTime: { type: "number" },
    secondHalfwidth: { type: "number", minimum: 0 },
  },
  required: ["firstTime", "firstHalfwidth", "secondTime", "secondHalfwidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapWidth: { type: "number" },
    mayOverlap: { type: "boolean" },
  },
  required: ["overlapWidth", "mayOverlap"],
} as const;
/** Overlap of supplied deidentified timestamp envelopes, without reconstructing event identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTime, firstHalfwidth, secondTime, secondHalfwidth } = request;
  const compute = (): Output => {
    H.domain(firstHalfwidth >= 0 && secondHalfwidth >= 0);
    return {
      overlapWidth: Math.max(
        0,
        Math.min(firstTime + firstHalfwidth, secondTime + secondHalfwidth) -
          Math.max(firstTime - firstHalfwidth, secondTime - secondHalfwidth),
      ),
      mayOverlap:
        Math.abs(firstTime - secondTime) <= firstHalfwidth + secondHalfwidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstTime: 10,
    firstHalfwidth: 2,
    secondTime: 13,
    secondHalfwidth: 2,
  },
  output: { overlapWidth: 1, mayOverlap: true },
} satisfies ToolExample<Input, Output>;
export const deidentifiedEventPrecisionOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "emergency-medicine/deidentified-event-precision-overlap",
    title: "Deidentified Event Precision Overlap Tool",
    description:
      "Overlap of supplied deidentified timestamp envelopes, without reconstructing event identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTime: { type: "number" },
        firstHalfwidth: { type: "number", minimum: 0 },
        secondTime: { type: "number" },
        secondHalfwidth: { type: "number", minimum: 0 },
      },
      required: [
        "firstTime",
        "firstHalfwidth",
        "secondTime",
        "secondHalfwidth",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapWidth: { type: "number" },
        mayOverlap: { type: "boolean" },
      },
      required: ["overlapWidth", "mayOverlap"],
    },
    ports: {
      inputs: [
        {
          id: "firstTime",
          label: "First Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstHalfwidth",
          label: "First Halfwidth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondTime",
          label: "Second Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondHalfwidth",
          label: "Second Halfwidth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapWidth",
          label: "Overlap Width",
          valueType: { type: "number" },
        },
        {
          id: "mayOverlap",
          label: "May Overlap",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = deidentifiedEventPrecisionOverlapTool.execute;
export default deidentifiedEventPrecisionOverlapTool;
