import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstEvent: number;
  readonly secondEvent: number;
  readonly suppliedExcludedInterval: number;
};
export type Output = {
  readonly elapsed: number;
  readonly countedInterval: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEvent: { type: "number" },
    secondEvent: { type: "number" },
    suppliedExcludedInterval: { type: "number", minimum: 0 },
  },
  required: ["firstEvent", "secondEvent", "suppliedExcludedInterval"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    countedInterval: { type: "number" },
  },
  required: ["elapsed", "countedInterval"],
} as const;
/** Supplied research event timing without evaluating a procedure or recommending durations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstEvent, secondEvent, suppliedExcludedInterval } = request;
  const compute = (): Output => {
    H.domain(
      secondEvent >= firstEvent &&
        suppliedExcludedInterval >= 0 &&
        suppliedExcludedInterval <= secondEvent - firstEvent,
    );
    return {
      elapsed: secondEvent - firstEvent,
      countedInterval: secondEvent - firstEvent - suppliedExcludedInterval,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstEvent: 10, secondEvent: 50, suppliedExcludedInterval: 5 },
  output: { elapsed: 40, countedInterval: 35 },
} satisfies ToolExample<Input, Output>;
export const procedureResearchEventGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oral-surgery/procedure-research-event-gap",
    title: "Procedure Research Event Gap Tool",
    description:
      "Supplied research event timing without evaluating a procedure or recommending durations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstEvent: { type: "number" },
        secondEvent: { type: "number" },
        suppliedExcludedInterval: { type: "number", minimum: 0 },
      },
      required: ["firstEvent", "secondEvent", "suppliedExcludedInterval"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        countedInterval: { type: "number" },
      },
      required: ["elapsed", "countedInterval"],
    },
    ports: {
      inputs: [
        {
          id: "firstEvent",
          label: "First Event",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondEvent",
          label: "Second Event",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedExcludedInterval",
          label: "Supplied Excluded Interval",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        {
          id: "countedInterval",
          label: "Counted Interval",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = procedureResearchEventGapTool.execute;
export default procedureResearchEventGapTool;
