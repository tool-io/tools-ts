import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly current: string;
  readonly expectedBefore: string;
  readonly next: string;
};
export type Output = {
  readonly applicable: boolean;
  readonly result: string;
  readonly changed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    current: { type: "string", maxLength: 8192 },
    expectedBefore: { type: "string", maxLength: 8192 },
    next: { type: "string", maxLength: 8192 },
  },
  required: ["current", "expectedBefore", "next"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    applicable: { type: "boolean" },
    result: { type: "string", maxLength: 8192 },
    changed: { type: "boolean" },
  },
  required: ["applicable", "result", "changed"],
} as const;
/** Apply a single prop-state transition only when its explicit precondition matches. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { current, expectedBefore, next } = request;
  const compute = (): Output => {
    const applicable = current === expectedBefore;
    return {
      applicable,
      result: applicable ? next : current,
      changed: applicable && next !== current,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { current: "closed", expectedBefore: "closed", next: "open" },
  output: { applicable: true, result: "open", changed: true },
} satisfies ToolExample<Input, Output>;
export const scenePropStateTransitionPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/scene-prop-state-transition-pair",
    title: "Scene Prop State Transition Pair Tool",
    description:
      "Apply a single prop-state transition only when its explicit precondition matches.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        current: { type: "string", maxLength: 8192 },
        expectedBefore: { type: "string", maxLength: 8192 },
        next: { type: "string", maxLength: 8192 },
      },
      required: ["current", "expectedBefore", "next"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        applicable: { type: "boolean" },
        result: { type: "string", maxLength: 8192 },
        changed: { type: "boolean" },
      },
      required: ["applicable", "result", "changed"],
    },
    ports: {
      inputs: [
        {
          id: "current",
          label: "Current",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedBefore",
          label: "Expected Before",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "next",
          label: "Next",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "applicable",
          label: "Applicable",
          valueType: { type: "boolean" },
        },
        { id: "result", label: "Result", valueType: { type: "string" } },
        { id: "changed", label: "Changed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = scenePropStateTransitionPairTool.execute;
export default scenePropStateTransitionPairTool;
