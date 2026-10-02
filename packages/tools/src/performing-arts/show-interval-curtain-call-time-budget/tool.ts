import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly acts: readonly number[];
  readonly intervals: readonly number[];
  readonly curtainCall: number;
  readonly houseOpen: number;
};
export type Output = {
  readonly performanceTime: number;
  readonly audienceWindow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    acts: { type: "array", maxItems: 256, items: { type: "number" } },
    intervals: { type: "array", maxItems: 256, items: { type: "number" } },
    curtainCall: { type: "number", minimum: 0 },
    houseOpen: { type: "number", minimum: 0 },
  },
  required: ["acts", "intervals", "curtainCall", "houseOpen"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    performanceTime: { type: "number" },
    audienceWindow: { type: "number" },
  },
  required: ["performanceTime", "audienceWindow"],
} as const;
/** Calculate show interval curtain call time budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { acts, intervals, curtainCall, houseOpen } = request;
  const compute = (): Output => {
    H.domain(
      acts.every((x) => x >= 0) &&
        intervals.every((x) => x >= 0) &&
        curtainCall >= 0 &&
        houseOpen >= 0,
    );
    return {
      performanceTime:
        acts.reduce((a, b) => a + b, 0) +
        intervals.reduce((a, b) => a + b, 0) +
        curtainCall,
      audienceWindow:
        acts.reduce((a, b) => a + b, 0) +
        intervals.reduce((a, b) => a + b, 0) +
        curtainCall +
        houseOpen,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { acts: [45, 50], intervals: [20], curtainCall: 5, houseOpen: 30 },
  output: { performanceTime: 120, audienceWindow: 150 },
} satisfies ToolExample<Input, Output>;
export const showIntervalCurtainCallTimeBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/show-interval-curtain-call-time-budget",
    title: "Show Interval Curtain Call Time Budget Tool",
    description:
      "Calculate show interval curtain call time budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        acts: { type: "array", maxItems: 256, items: { type: "number" } },
        intervals: { type: "array", maxItems: 256, items: { type: "number" } },
        curtainCall: { type: "number", minimum: 0 },
        houseOpen: { type: "number", minimum: 0 },
      },
      required: ["acts", "intervals", "curtainCall", "houseOpen"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        performanceTime: { type: "number" },
        audienceWindow: { type: "number" },
      },
      required: ["performanceTime", "audienceWindow"],
    },
    ports: {
      inputs: [
        {
          id: "acts",
          label: "Acts",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "intervals",
          label: "Intervals",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "curtainCall",
          label: "Curtain Call",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "houseOpen",
          label: "House Open",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "performanceTime",
          label: "Performance Time",
          valueType: { type: "number" },
        },
        {
          id: "audienceWindow",
          label: "Audience Window",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = showIntervalCurtainCallTimeBudgetTool.execute;
export default showIntervalCurtainCallTimeBudgetTool;
