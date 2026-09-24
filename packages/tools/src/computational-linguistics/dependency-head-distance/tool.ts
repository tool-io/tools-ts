import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tokenIndex: number;
  readonly headIndex: number;
  readonly rootHead: boolean;
};
export type Output = {
  readonly signedDistance: number;
  readonly absoluteDistance: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokenIndex: { type: "integer", minimum: 0 },
    headIndex: { type: "integer", minimum: 0 },
    rootHead: { type: "boolean" },
  },
  required: ["tokenIndex", "headIndex", "rootHead"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDistance: { type: "integer" },
    absoluteDistance: { type: "integer" },
    defined: { type: "boolean" },
  },
  required: ["signedDistance", "absoluteDistance", "defined"],
} as const;
/** Resolve one supplied dependency edge in a common token-index convention, preserving a root-head flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tokenIndex, headIndex, rootHead } = request;
  const compute = (): Output => {
    H.integer(tokenIndex, 0);
    H.integer(headIndex, 0);
    return {
      signedDistance: rootHead ? 0 : headIndex - tokenIndex,
      absoluteDistance: rootHead ? 0 : Math.abs(headIndex - tokenIndex),
      defined: !rootHead,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tokenIndex: 5, headIndex: 2, rootHead: false },
  output: { signedDistance: -3, absoluteDistance: 3, defined: true },
} satisfies ToolExample<Input, Output>;
export const dependencyHeadDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-linguistics/dependency-head-distance",
    title: "Dependency Head Distance Tool",
    description:
      "Resolve one supplied dependency edge in a common token-index convention, preserving a root-head flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokenIndex: { type: "integer", minimum: 0 },
        headIndex: { type: "integer", minimum: 0 },
        rootHead: { type: "boolean" },
      },
      required: ["tokenIndex", "headIndex", "rootHead"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedDistance: { type: "integer" },
        absoluteDistance: { type: "integer" },
        defined: { type: "boolean" },
      },
      required: ["signedDistance", "absoluteDistance", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "tokenIndex",
          label: "Token Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "headIndex",
          label: "Head Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rootHead",
          label: "Root Head",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "signedDistance",
          label: "Signed Distance",
          valueType: { type: "integer" },
        },
        {
          id: "absoluteDistance",
          label: "Absolute Distance",
          valueType: { type: "integer" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = dependencyHeadDistanceTool.execute;
export default dependencyHeadDistanceTool;
