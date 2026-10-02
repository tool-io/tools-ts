import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signal: number;
  readonly oldBaseline: number;
  readonly newBaseline: number;
};
export type Output = {
  readonly relativeToOld: number;
  readonly relativeToNew: number;
  readonly baselineShift: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signal: { type: "number" },
    oldBaseline: { type: "number" },
    newBaseline: { type: "number" },
  },
  required: ["signal", "oldBaseline", "newBaseline"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeToOld: { type: "number" },
    relativeToNew: { type: "number" },
    baselineShift: { type: "number" },
  },
  required: ["relativeToOld", "relativeToNew", "baselineShift"],
} as const;
/** Compare supplied research signal baseline choices without physiological diagnosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signal, oldBaseline, newBaseline } = request;
  const compute = (): Output => {
    return {
      relativeToOld: signal - oldBaseline,
      relativeToNew: signal - newBaseline,
      baselineShift: newBaseline - oldBaseline,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signal: 10, oldBaseline: 2, newBaseline: 4 },
  output: { relativeToOld: 8, relativeToNew: 6, baselineShift: 2 },
} satisfies ToolExample<Input, Output>;
export const researchSignalBaselineShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiology/research-signal-baseline-shift",
    title: "Research Signal Baseline Shift Tool",
    description:
      "Compare supplied research signal baseline choices without physiological diagnosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signal: { type: "number" },
        oldBaseline: { type: "number" },
        newBaseline: { type: "number" },
      },
      required: ["signal", "oldBaseline", "newBaseline"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeToOld: { type: "number" },
        relativeToNew: { type: "number" },
        baselineShift: { type: "number" },
      },
      required: ["relativeToOld", "relativeToNew", "baselineShift"],
    },
    ports: {
      inputs: [
        {
          id: "signal",
          label: "Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oldBaseline",
          label: "Old Baseline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newBaseline",
          label: "New Baseline",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeToOld",
          label: "Relative To Old",
          valueType: { type: "number" },
        },
        {
          id: "relativeToNew",
          label: "Relative To New",
          valueType: { type: "number" },
        },
        {
          id: "baselineShift",
          label: "Baseline Shift",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchSignalBaselineShiftTool.execute;
export default researchSignalBaselineShiftTool;
