import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStart: number;
  readonly nextStart: number;
  readonly suppliedPause: number;
  readonly cycles: number;
};
export type Output = {
  readonly elapsed: number;
  readonly activePerCycle: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStart: { type: "number" },
    nextStart: { type: "number" },
    suppliedPause: { type: "number", minimum: 0 },
    cycles: { type: "integer", minimum: 1 },
  },
  required: ["firstStart", "nextStart", "suppliedPause", "cycles"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    activePerCycle: { type: "number" },
  },
  required: ["elapsed", "activePerCycle"],
} as const;
/** Supplied research motion-cycle timing without a movement quality or exercise prescription. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStart, nextStart, suppliedPause, cycles } = request;
  const compute = (): Output => {
    H.integer(cycles, 1);
    H.domain(
      nextStart >= firstStart &&
        suppliedPause >= 0 &&
        suppliedPause <= nextStart - firstStart,
    );
    return {
      elapsed: nextStart - firstStart,
      activePerCycle: (nextStart - firstStart - suppliedPause) / cycles,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstStart: 10, nextStart: 30, suppliedPause: 4, cycles: 2 },
  output: { elapsed: 20, activePerCycle: 8 },
} satisfies ToolExample<Input, Output>;
export const researchMotionCycleDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiotherapy/research-motion-cycle-duration",
    title: "Research Motion Cycle Duration Tool",
    description:
      "Supplied research motion-cycle timing without a movement quality or exercise prescription.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStart: { type: "number" },
        nextStart: { type: "number" },
        suppliedPause: { type: "number", minimum: 0 },
        cycles: { type: "integer", minimum: 1 },
      },
      required: ["firstStart", "nextStart", "suppliedPause", "cycles"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        activePerCycle: { type: "number" },
      },
      required: ["elapsed", "activePerCycle"],
    },
    ports: {
      inputs: [
        {
          id: "firstStart",
          label: "First Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextStart",
          label: "Next Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPause",
          label: "Supplied Pause",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cycles",
          label: "Cycles",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        {
          id: "activePerCycle",
          label: "Active Per Cycle",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchMotionCycleDurationTool.execute;
export default researchMotionCycleDurationTool;
