import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly returnDeadline: number;
  readonly pickupTime: number;
  readonly processingHours: number;
  readonly travelHours: number;
};
export type Output = { readonly readyTime: number; readonly slack: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returnDeadline: { type: "number" },
    pickupTime: { type: "number" },
    processingHours: { type: "number", minimum: 0 },
    travelHours: { type: "number", minimum: 0 },
  },
  required: ["returnDeadline", "pickupTime", "processingHours", "travelHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { readyTime: { type: "number" }, slack: { type: "number" } },
  required: ["readyTime", "slack"],
} as const;
/** Calculate linen laundry turnaround slack from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { returnDeadline, pickupTime, processingHours, travelHours } = request;
  const compute = (): Output => {
    H.domain(processingHours >= 0 && travelHours >= 0);
    return {
      readyTime: pickupTime + processingHours + travelHours,
      slack: returnDeadline - pickupTime - processingHours - travelHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    returnDeadline: 48,
    pickupTime: 12,
    processingHours: 20,
    travelHours: 4,
  },
  output: { readyTime: 36, slack: 12 },
} satisfies ToolExample<Input, Output>;
export const linenLaundryTurnaroundSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/linen-laundry-turnaround-slack",
    title: "Linen Laundry Turnaround Slack Tool",
    description:
      "Calculate linen laundry turnaround slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        returnDeadline: { type: "number" },
        pickupTime: { type: "number" },
        processingHours: { type: "number", minimum: 0 },
        travelHours: { type: "number", minimum: 0 },
      },
      required: [
        "returnDeadline",
        "pickupTime",
        "processingHours",
        "travelHours",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { readyTime: { type: "number" }, slack: { type: "number" } },
      required: ["readyTime", "slack"],
    },
    ports: {
      inputs: [
        {
          id: "returnDeadline",
          label: "Return Deadline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pickupTime",
          label: "Pickup Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "processingHours",
          label: "Processing Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "travelHours",
          label: "Travel Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "readyTime", label: "Ready Time", valueType: { type: "number" } },
        { id: "slack", label: "Slack", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = linenLaundryTurnaroundSlackTool.execute;
export default linenLaundryTurnaroundSlackTool;
