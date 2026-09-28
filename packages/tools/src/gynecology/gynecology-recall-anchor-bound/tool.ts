import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventLower: number;
  readonly eventUpper: number;
  readonly anchorLower: number;
  readonly anchorUpper: number;
};
export type Output = {
  readonly offsetLower: number;
  readonly offsetUpper: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventLower: { type: "number" },
    eventUpper: { type: "number" },
    anchorLower: { type: "number" },
    anchorUpper: { type: "number" },
  },
  required: ["eventLower", "eventUpper", "anchorLower", "anchorUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offsetLower: { type: "number" },
    offsetUpper: { type: "number" },
  },
  required: ["offsetLower", "offsetUpper"],
} as const;
/** Propagate supplied independent research diary event and anchor bounds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventLower, eventUpper, anchorLower, anchorUpper } = request;
  const compute = (): Output => {
    H.domain(eventLower <= eventUpper && anchorLower <= anchorUpper);
    return {
      offsetLower: eventLower - anchorUpper,
      offsetUpper: eventUpper - anchorLower,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventLower: 20, eventUpper: 22, anchorLower: 5, anchorUpper: 8 },
  output: { offsetLower: 12, offsetUpper: 17 },
} satisfies ToolExample<Input, Output>;
export const gynecologyRecallAnchorBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gynecology/gynecology-recall-anchor-bound",
    title: "Gynecology Recall Anchor Bound Tool",
    description:
      "Propagate supplied independent research diary event and anchor bounds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventLower: { type: "number" },
        eventUpper: { type: "number" },
        anchorLower: { type: "number" },
        anchorUpper: { type: "number" },
      },
      required: ["eventLower", "eventUpper", "anchorLower", "anchorUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offsetLower: { type: "number" },
        offsetUpper: { type: "number" },
      },
      required: ["offsetLower", "offsetUpper"],
    },
    ports: {
      inputs: [
        {
          id: "eventLower",
          label: "Event Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eventUpper",
          label: "Event Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "anchorLower",
          label: "Anchor Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "anchorUpper",
          label: "Anchor Upper",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "offsetLower",
          label: "Offset Lower",
          valueType: { type: "number" },
        },
        {
          id: "offsetUpper",
          label: "Offset Upper",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gynecologyRecallAnchorBoundTool.execute;
export default gynecologyRecallAnchorBoundTool;
