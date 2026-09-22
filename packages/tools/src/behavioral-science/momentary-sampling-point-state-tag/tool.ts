import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly times: readonly number[];
  readonly states: readonly boolean[];
  readonly sampleTime: number;
};
export type Output = {
  readonly found: boolean;
  readonly state: boolean;
  readonly index: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    times: { type: "array", maxItems: 256, items: { type: "number" } },
    states: { type: "array", maxItems: 256, items: { type: "boolean" } },
    sampleTime: { type: "number" },
  },
  required: ["times", "states", "sampleTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    found: { type: "boolean" },
    state: { type: "boolean" },
    index: { type: "integer" },
  },
  required: ["found", "state", "index"],
} as const;
/** Exact recorded instant lookup; a missing instant returns found=false rather than interpolating a behavioral state. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { times, states, sampleTime } = request;
  const compute = (): Output => {
    H.sameLength(times, states);
    H.domain(times.every((x, i) => i === 0 || x > times[i - 1]));
    const index = times.indexOf(sampleTime);
    return {
      found: index >= 0,
      state: index < 0 ? false : states[index],
      index,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { times: [1, 2, 3], states: [false, true, false], sampleTime: 2 },
  output: { found: true, state: true, index: 1 },
} satisfies ToolExample<Input, Output>;
export const momentarySamplingPointStateTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-science/momentary-sampling-point-state-tag",
    title: "Momentary Sampling Point State Tag Tool",
    description:
      "Exact recorded instant lookup; a missing instant returns found=false rather than interpolating a behavioral state.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        times: { type: "array", maxItems: 256, items: { type: "number" } },
        states: { type: "array", maxItems: 256, items: { type: "boolean" } },
        sampleTime: { type: "number" },
      },
      required: ["times", "states", "sampleTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        found: { type: "boolean" },
        state: { type: "boolean" },
        index: { type: "integer" },
      },
      required: ["found", "state", "index"],
    },
    ports: {
      inputs: [
        {
          id: "times",
          label: "Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "states",
          label: "States",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sampleTime",
          label: "Sample Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "found", label: "Found", valueType: { type: "boolean" } },
        { id: "state", label: "State", valueType: { type: "boolean" } },
        { id: "index", label: "Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = momentarySamplingPointStateTagTool.execute;
export default momentarySamplingPointStateTagTool;
