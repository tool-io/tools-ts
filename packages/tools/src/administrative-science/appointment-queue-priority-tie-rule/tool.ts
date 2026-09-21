import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPriority: number;
  readonly secondPriority: number;
  readonly firstArrival: number;
  readonly secondArrival: number;
  readonly largerPriorityFirst: boolean;
};
export type Output = { readonly order: number; readonly priorityTie: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPriority: { type: "number" },
    secondPriority: { type: "number" },
    firstArrival: { type: "number" },
    secondArrival: { type: "number" },
    largerPriorityFirst: { type: "boolean" },
  },
  required: [
    "firstPriority",
    "secondPriority",
    "firstArrival",
    "secondArrival",
    "largerPriorityFirst",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { order: { type: "integer" }, priorityTie: { type: "boolean" } },
  required: ["order", "priorityTie"],
} as const;
/** Calculate appointment queue priority tie rule from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstPriority,
    secondPriority,
    firstArrival,
    secondArrival,
    largerPriorityFirst,
  } = request;
  const compute = (): Output => {
    const priorityTie = firstPriority === secondPriority;
    return {
      order: priorityTie
        ? Math.sign(firstArrival - secondArrival)
        : (largerPriorityFirst ? -1 : 1) *
          Math.sign(firstPriority - secondPriority),
      priorityTie,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstPriority: 2,
    secondPriority: 1,
    firstArrival: 20,
    secondArrival: 10,
    largerPriorityFirst: true,
  },
  output: { order: -1, priorityTie: false },
} satisfies ToolExample<Input, Output>;
export const appointmentQueuePriorityTieRuleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "administrative-science/appointment-queue-priority-tie-rule",
    title: "Appointment Queue Priority Tie Rule Tool",
    description:
      "Calculate appointment queue priority tie rule from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPriority: { type: "number" },
        secondPriority: { type: "number" },
        firstArrival: { type: "number" },
        secondArrival: { type: "number" },
        largerPriorityFirst: { type: "boolean" },
      },
      required: [
        "firstPriority",
        "secondPriority",
        "firstArrival",
        "secondArrival",
        "largerPriorityFirst",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        order: { type: "integer" },
        priorityTie: { type: "boolean" },
      },
      required: ["order", "priorityTie"],
    },
    ports: {
      inputs: [
        {
          id: "firstPriority",
          label: "First Priority",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondPriority",
          label: "Second Priority",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstArrival",
          label: "First Arrival",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondArrival",
          label: "Second Arrival",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "largerPriorityFirst",
          label: "Larger Priority First",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "order", label: "Order", valueType: { type: "integer" } },
        {
          id: "priorityTie",
          label: "Priority Tie",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = appointmentQueuePriorityTieRuleTool.execute;
export default appointmentQueuePriorityTieRuleTool;
