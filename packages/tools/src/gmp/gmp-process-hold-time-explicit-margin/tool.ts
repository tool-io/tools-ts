import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly holdStart: number;
  readonly holdEnd: number;
  readonly paused: number;
  readonly suppliedMaximum: number;
  readonly includePause: boolean;
};
export type Output = {
  readonly elapsed: number;
  readonly counted: number;
  readonly margin: number;
  readonly within: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    holdStart: { type: "number" },
    holdEnd: { type: "number" },
    paused: { type: "number", minimum: 0 },
    suppliedMaximum: { type: "number", minimum: 0 },
    includePause: { type: "boolean" },
  },
  required: [
    "holdStart",
    "holdEnd",
    "paused",
    "suppliedMaximum",
    "includePause",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    counted: { type: "number" },
    margin: { type: "number" },
    within: { type: "boolean" },
  },
  required: ["elapsed", "counted", "margin", "within"],
} as const;
/** Compare an explicitly counted hold interval against a supplied limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { holdStart, holdEnd, paused, suppliedMaximum, includePause } = request;
  const compute = (): Output => {
    H.domain(
      holdEnd >= holdStart &&
        paused >= 0 &&
        paused <= holdEnd - holdStart &&
        suppliedMaximum >= 0,
    );
    return {
      elapsed: holdEnd - holdStart,
      counted: holdEnd - holdStart - (includePause ? 0 : paused),
      margin:
        suppliedMaximum - holdEnd + holdStart + (includePause ? 0 : paused),
      within:
        holdEnd - holdStart - (includePause ? 0 : paused) <= suppliedMaximum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    holdStart: 100,
    holdEnd: 120,
    paused: 5,
    suppliedMaximum: 18,
    includePause: false,
  },
  output: { elapsed: 20, counted: 15, margin: 3, within: true },
} satisfies ToolExample<Input, Output>;
export const gmpProcessHoldTimeExplicitMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/gmp-process-hold-time-explicit-margin",
    title: "GMP Process Hold Time Explicit Margin Tool",
    description:
      "Compare an explicitly counted hold interval against a supplied limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        holdStart: { type: "number" },
        holdEnd: { type: "number" },
        paused: { type: "number", minimum: 0 },
        suppliedMaximum: { type: "number", minimum: 0 },
        includePause: { type: "boolean" },
      },
      required: [
        "holdStart",
        "holdEnd",
        "paused",
        "suppliedMaximum",
        "includePause",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        counted: { type: "number" },
        margin: { type: "number" },
        within: { type: "boolean" },
      },
      required: ["elapsed", "counted", "margin", "within"],
    },
    ports: {
      inputs: [
        {
          id: "holdStart",
          label: "Hold Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "holdEnd",
          label: "Hold End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paused",
          label: "Paused",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedMaximum",
          label: "Supplied Maximum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includePause",
          label: "Include Pause",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        { id: "counted", label: "Counted", valueType: { type: "number" } },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        { id: "within", label: "Within", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = gmpProcessHoldTimeExplicitMarginTool.execute;
export default gmpProcessHoldTimeExplicitMarginTool;
