import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTime: number;
  readonly firstHalfwidth: number;
  readonly secondTime: number;
  readonly secondHalfwidth: number;
};
export type Output = {
  readonly minimumGap: number;
  readonly maximumGap: number;
  readonly definitelyOrdered: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTime: { type: "number" },
    firstHalfwidth: { type: "number", minimum: 0 },
    secondTime: { type: "number" },
    secondHalfwidth: { type: "number" },
  },
  required: ["firstTime", "firstHalfwidth", "secondTime", "secondHalfwidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumGap: { type: "number" },
    maximumGap: { type: "number" },
    definitelyOrdered: { type: "boolean" },
  },
  required: ["minimumGap", "maximumGap", "definitelyOrdered"],
} as const;
/** Bound an event-time gap from two symmetric uncertainty intervals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTime, firstHalfwidth, secondTime, secondHalfwidth } = request;
  const compute = (): Output => {
    H.domain(firstHalfwidth >= 0 && secondHalfwidth >= 0, "firstHalfwidth");
    return {
      minimumGap: secondTime - secondHalfwidth - firstTime - firstHalfwidth,
      maximumGap: secondTime + secondHalfwidth - firstTime + firstHalfwidth,
      definitelyOrdered:
        secondTime - secondHalfwidth > firstTime + firstHalfwidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstTime: 10,
    firstHalfwidth: 1,
    secondTime: 15,
    secondHalfwidth: 2,
  },
  output: { minimumGap: 2, maximumGap: 8, definitelyOrdered: true },
} satisfies ToolExample<Input, Output>;
export const anesthesiaStudyEventPrecisionEnvelopeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "anesthesiology/anesthesia-study-event-precision-envelope",
      title: "Anesthesia Study Event Precision Envelope Tool",
      description:
        "Bound an event-time gap from two symmetric uncertainty intervals.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstTime: { type: "number" },
          firstHalfwidth: { type: "number", minimum: 0 },
          secondTime: { type: "number" },
          secondHalfwidth: { type: "number" },
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
          minimumGap: { type: "number" },
          maximumGap: { type: "number" },
          definitelyOrdered: { type: "boolean" },
        },
        required: ["minimumGap", "maximumGap", "definitelyOrdered"],
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
            id: "minimumGap",
            label: "Minimum Gap",
            valueType: { type: "number" },
          },
          {
            id: "maximumGap",
            label: "Maximum Gap",
            valueType: { type: "number" },
          },
          {
            id: "definitelyOrdered",
            label: "Definitely Ordered",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = anesthesiaStudyEventPrecisionEnvelopeTool.execute;
export default anesthesiaStudyEventPrecisionEnvelopeTool;
