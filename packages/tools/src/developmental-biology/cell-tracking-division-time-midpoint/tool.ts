import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lastUndividedTime: number;
  readonly firstDividedTime: number;
};
export type Output = {
  readonly estimatedDivisionTime: number;
  readonly uncertaintyWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lastUndividedTime: { type: "number" },
    firstDividedTime: { type: "number" },
  },
  required: ["lastUndividedTime", "firstDividedTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    estimatedDivisionTime: { type: "number" },
    uncertaintyWidth: { type: "number" },
  },
  required: ["estimatedDivisionTime", "uncertaintyWidth"],
} as const;
/** Report midpoint and width of an explicitly supplied cell-division observation bracket without claiming exact division timing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lastUndividedTime, firstDividedTime } = request;
  const compute = (): Output => {
    H.domain(firstDividedTime >= lastUndividedTime, "firstDividedTime");
    return {
      estimatedDivisionTime: lastUndividedTime / 2 + firstDividedTime / 2,
      uncertaintyWidth: firstDividedTime - lastUndividedTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lastUndividedTime: 10, firstDividedTime: 14 },
  output: { estimatedDivisionTime: 12, uncertaintyWidth: 4 },
} satisfies ToolExample<Input, Output>;
export const cellTrackingDivisionTimeMidpointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/cell-tracking-division-time-midpoint",
    title: "Cell Tracking Division Time Midpoint Tool",
    description:
      "Report midpoint and width of an explicitly supplied cell-division observation bracket without claiming exact division timing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lastUndividedTime: { type: "number" },
        firstDividedTime: { type: "number" },
      },
      required: ["lastUndividedTime", "firstDividedTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        estimatedDivisionTime: { type: "number" },
        uncertaintyWidth: { type: "number" },
      },
      required: ["estimatedDivisionTime", "uncertaintyWidth"],
    },
    ports: {
      inputs: [
        {
          id: "lastUndividedTime",
          label: "Last Undivided Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstDividedTime",
          label: "First Divided Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "estimatedDivisionTime",
          label: "Estimated Division Time",
          valueType: { type: "number" },
        },
        {
          id: "uncertaintyWidth",
          label: "Uncertainty Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cellTrackingDivisionTimeMidpointTool.execute;
export default cellTrackingDivisionTimeMidpointTool;
