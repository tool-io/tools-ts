import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = {
  readonly halfspaceTie: boolean;
  readonly forwardDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "integer", minimum: 0, maximum: 4294967295 },
    second: { type: "integer", minimum: 0, maximum: 4294967295 },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    halfspaceTie: { type: "boolean" },
    forwardDistance: { type: "integer" },
  },
  required: ["halfspaceTie", "forwardDistance"],
} as const;
/** Detect antipodal 32-bit TCP sequence values where modular before/after comparison is ambiguous. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.integer(first, 0, 4294967295);
    H.integer(second, 0, 4294967295);
    return {
      halfspaceTie: H.mod(second - first, 4294967296) === 2147483648,
      forwardDistance: H.mod(second - first, 4294967296),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 0, second: 2147483648 },
  output: { halfspaceTie: true, forwardDistance: 2147483648 },
} satisfies ToolExample<Input, Output>;
export const tcpSequenceHalfspaceTieTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/tcp-sequence-halfspace-tie",
    title: "TCP Sequence Halfspace Tie Tool",
    description:
      "Detect antipodal 32-bit TCP sequence values where modular before/after comparison is ambiguous.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "integer", minimum: 0, maximum: 4294967295 },
        second: { type: "integer", minimum: 0, maximum: 4294967295 },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        halfspaceTie: { type: "boolean" },
        forwardDistance: { type: "integer" },
      },
      required: ["halfspaceTie", "forwardDistance"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "halfspaceTie",
          label: "Halfspace Tie",
          valueType: { type: "boolean" },
        },
        {
          id: "forwardDistance",
          label: "Forward Distance",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = tcpSequenceHalfspaceTieTool.execute;
export default tcpSequenceHalfspaceTieTool;
