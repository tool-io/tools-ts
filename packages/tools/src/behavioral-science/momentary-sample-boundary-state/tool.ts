import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleTime: number;
  readonly stateStart: number;
  readonly stateEnd: number;
  readonly includeStart: boolean;
  readonly includeEnd: boolean;
};
export type Output = { readonly active: boolean; readonly onBoundary: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleTime: { type: "number" },
    stateStart: { type: "number" },
    stateEnd: { type: "number" },
    includeStart: { type: "boolean" },
    includeEnd: { type: "boolean" },
  },
  required: [
    "sampleTime",
    "stateStart",
    "stateEnd",
    "includeStart",
    "includeEnd",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { active: { type: "boolean" }, onBoundary: { type: "boolean" } },
  required: ["active", "onBoundary"],
} as const;
/** Membership of an observed instant in an explicitly annotated state interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleTime, stateStart, stateEnd, includeStart, includeEnd } =
    request;
  const compute = (): Output => {
    H.domain(stateEnd >= stateStart);
    return {
      active:
        (includeStart ? sampleTime >= stateStart : sampleTime > stateStart) &&
        (includeEnd ? sampleTime <= stateEnd : sampleTime < stateEnd),
      onBoundary: sampleTime === stateStart || sampleTime === stateEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleTime: 10,
    stateStart: 10,
    stateEnd: 20,
    includeStart: true,
    includeEnd: false,
  },
  output: { active: true, onBoundary: true },
} satisfies ToolExample<Input, Output>;
export const momentarySampleBoundaryStateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-science/momentary-sample-boundary-state",
    title: "Momentary Sample Boundary State Tool",
    description:
      "Membership of an observed instant in an explicitly annotated state interval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleTime: { type: "number" },
        stateStart: { type: "number" },
        stateEnd: { type: "number" },
        includeStart: { type: "boolean" },
        includeEnd: { type: "boolean" },
      },
      required: [
        "sampleTime",
        "stateStart",
        "stateEnd",
        "includeStart",
        "includeEnd",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        active: { type: "boolean" },
        onBoundary: { type: "boolean" },
      },
      required: ["active", "onBoundary"],
    },
    ports: {
      inputs: [
        {
          id: "sampleTime",
          label: "Sample Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stateStart",
          label: "State Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stateEnd",
          label: "State End",
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
        { id: "active", label: "Active", valueType: { type: "boolean" } },
        {
          id: "onBoundary",
          label: "On Boundary",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = momentarySampleBoundaryStateTool.execute;
export default momentarySampleBoundaryStateTool;
