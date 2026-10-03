import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly stateLength: number; readonly index: number };
export type Output = { readonly nextIndex: number; readonly dropped: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stateLength: { type: "integer", minimum: 1 },
    index: { type: "integer", minimum: 0 },
  },
  required: ["stateLength", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nextIndex: { type: "integer" }, dropped: { type: "boolean" } },
  required: ["nextIndex", "dropped"],
} as const;
/** Calculate recurrence delay state shift index from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stateLength, index } = request;
  const compute = (): Output => {
    H.integer(stateLength, 1);
    H.integer(index, 0, stateLength - 1);
    return {
      nextIndex: index === stateLength - 1 ? -1 : index + 1,
      dropped: index === stateLength - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stateLength: 4, index: 2 },
  output: { nextIndex: 3, dropped: false },
} satisfies ToolExample<Input, Output>;
export const recurrenceDelayStateShiftIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/recurrence-delay-state-shift-index",
    title: "Recurrence Delay State Shift Index Tool",
    description:
      "Calculate recurrence delay state shift index from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stateLength: { type: "integer", minimum: 1 },
        index: { type: "integer", minimum: 0 },
      },
      required: ["stateLength", "index"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nextIndex: { type: "integer" },
        dropped: { type: "boolean" },
      },
      required: ["nextIndex", "dropped"],
    },
    ports: {
      inputs: [
        {
          id: "stateLength",
          label: "State Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nextIndex",
          label: "Next Index",
          valueType: { type: "integer" },
        },
        { id: "dropped", label: "Dropped", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = recurrenceDelayStateShiftIndexTool.execute;
export default recurrenceDelayStateShiftIndexTool;
