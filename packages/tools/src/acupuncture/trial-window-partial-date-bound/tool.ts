import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventLower: number;
  readonly eventUpper: number;
  readonly windowLower: number;
  readonly windowUpper: number;
};
export type Output = {
  readonly definitelyInside: boolean;
  readonly possiblyInside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventLower: { type: "integer" },
    eventUpper: { type: "integer" },
    windowLower: { type: "integer" },
    windowUpper: { type: "integer" },
  },
  required: ["eventLower", "eventUpper", "windowLower", "windowUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    definitelyInside: { type: "boolean" },
    possiblyInside: { type: "boolean" },
  },
  required: ["definitelyInside", "possiblyInside"],
} as const;
/** Compare supplied absolute-day trial window and event bounds, without treatment or scheduling advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventLower, eventUpper, windowLower, windowUpper } = request;
  const compute = (): Output => {
    H.domain(eventLower <= eventUpper && windowLower <= windowUpper);
    return {
      definitelyInside: eventLower >= windowLower && eventUpper <= windowUpper,
      possiblyInside: eventUpper >= windowLower && eventLower <= windowUpper,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventLower: 10, eventUpper: 12, windowLower: 9, windowUpper: 13 },
  output: { definitelyInside: true, possiblyInside: true },
} satisfies ToolExample<Input, Output>;
export const trialWindowPartialDateBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "acupuncture/trial-window-partial-date-bound",
    title: "Trial Window Partial Date Bound Tool",
    description:
      "Compare supplied absolute-day trial window and event bounds, without treatment or scheduling advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventLower: { type: "integer" },
        eventUpper: { type: "integer" },
        windowLower: { type: "integer" },
        windowUpper: { type: "integer" },
      },
      required: ["eventLower", "eventUpper", "windowLower", "windowUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        definitelyInside: { type: "boolean" },
        possiblyInside: { type: "boolean" },
      },
      required: ["definitelyInside", "possiblyInside"],
    },
    ports: {
      inputs: [
        {
          id: "eventLower",
          label: "Event Lower",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "eventUpper",
          label: "Event Upper",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "windowLower",
          label: "Window Lower",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "windowUpper",
          label: "Window Upper",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "definitelyInside",
          label: "Definitely Inside",
          valueType: { type: "boolean" },
        },
        {
          id: "possiblyInside",
          label: "Possibly Inside",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialWindowPartialDateBoundTool.execute;
export default trialWindowPartialDateBoundTool;
