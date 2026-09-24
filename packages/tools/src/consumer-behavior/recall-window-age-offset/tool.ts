import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventAt: number;
  readonly interviewAt: number;
  readonly windowLength: number;
};
export type Output = {
  readonly age: number;
  readonly boundaryOffset: number;
  readonly withinWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventAt: { type: "number" },
    interviewAt: { type: "number" },
    windowLength: { type: "number", minimum: 0 },
  },
  required: ["eventAt", "interviewAt", "windowLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    age: { type: "number" },
    boundaryOffset: { type: "number" },
    withinWindow: { type: "boolean" },
  },
  required: ["age", "boundaryOffset", "withinWindow"],
} as const;
/** Calculate recall window age offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventAt, interviewAt, windowLength } = request;
  const compute = (): Output => {
    H.domain(windowLength >= 0);
    return {
      age: interviewAt - eventAt,
      boundaryOffset: interviewAt - eventAt - windowLength,
      withinWindow:
        interviewAt >= eventAt && interviewAt - eventAt <= windowLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventAt: 10, interviewAt: 25, windowLength: 20 },
  output: { age: 15, boundaryOffset: -5, withinWindow: true },
} satisfies ToolExample<Input, Output>;
export const recallWindowAgeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "consumer-behavior/recall-window-age-offset",
    title: "Recall Window Age Offset Tool",
    description:
      "Calculate recall window age offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventAt: { type: "number" },
        interviewAt: { type: "number" },
        windowLength: { type: "number", minimum: 0 },
      },
      required: ["eventAt", "interviewAt", "windowLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        age: { type: "number" },
        boundaryOffset: { type: "number" },
        withinWindow: { type: "boolean" },
      },
      required: ["age", "boundaryOffset", "withinWindow"],
    },
    ports: {
      inputs: [
        {
          id: "eventAt",
          label: "Event At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "interviewAt",
          label: "Interview At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowLength",
          label: "Window Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "age", label: "Age", valueType: { type: "number" } },
        {
          id: "boundaryOffset",
          label: "Boundary Offset",
          valueType: { type: "number" },
        },
        {
          id: "withinWindow",
          label: "Within Window",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = recallWindowAgeOffsetTool.execute;
export default recallWindowAgeOffsetTool;
