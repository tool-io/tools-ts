import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly time: number;
  readonly eventStart: number;
  readonly eventEnd: number;
  readonly includeStart: boolean;
  readonly includeEnd: boolean;
};
export type Output = { readonly membership: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    time: { type: "number" },
    eventStart: { type: "number" },
    eventEnd: { type: "number" },
    includeStart: { type: "boolean" },
    includeEnd: { type: "boolean" },
  },
  required: ["time", "eventStart", "eventEnd", "includeStart", "includeEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { membership: { type: "string", maxLength: 8192 } },
  required: ["membership"],
} as const;
/** Classify one supplied hydrograph time under explicit event endpoint conventions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { time, eventStart, eventEnd, includeStart, includeEnd } = request;
  const compute = (): Output => {
    H.domain(eventEnd >= eventStart);
    const inside =
      (includeStart ? time >= eventStart : time > eventStart) &&
      (includeEnd ? time <= eventEnd : time < eventEnd);
    return {
      membership: inside
        ? "inside"
        : time === eventStart || time === eventEnd
          ? "excluded-boundary"
          : time < eventStart
            ? "before"
            : "after",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    time: 10,
    eventStart: 10,
    eventEnd: 20,
    includeStart: false,
    includeEnd: true,
  },
  output: { membership: "excluded-boundary" },
} satisfies ToolExample<Input, Output>;
export const hydrographEventBoundaryTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/hydrograph-event-boundary-token",
    title: "Hydrograph Event Boundary Token Tool",
    description:
      "Classify one supplied hydrograph time under explicit event endpoint conventions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        time: { type: "number" },
        eventStart: { type: "number" },
        eventEnd: { type: "number" },
        includeStart: { type: "boolean" },
        includeEnd: { type: "boolean" },
      },
      required: [
        "time",
        "eventStart",
        "eventEnd",
        "includeStart",
        "includeEnd",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { membership: { type: "string", maxLength: 8192 } },
      required: ["membership"],
    },
    ports: {
      inputs: [
        {
          id: "time",
          label: "Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eventStart",
          label: "Event Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eventEnd",
          label: "Event End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeStart",
          label: "Include Start",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeEnd",
          label: "Include End",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "membership",
          label: "Membership",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = hydrographEventBoundaryTokenTool.execute;
export default hydrographEventBoundaryTokenTool;
