import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly forwardPresent: boolean;
  readonly reversePresent: boolean;
  readonly selfLoop: boolean;
};
export type Output = {
  readonly reciprocal: boolean;
  readonly directedEdgeCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forwardPresent: { type: "boolean" },
    reversePresent: { type: "boolean" },
    selfLoop: { type: "boolean" },
  },
  required: ["forwardPresent", "reversePresent", "selfLoop"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reciprocal: { type: "boolean" },
    directedEdgeCount: { type: "integer" },
  },
  required: ["reciprocal", "directedEdgeCount"],
} as const;
/** Inspect one directed pair; a self-loop has identical forward/reverse flags and counts once. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { forwardPresent, reversePresent, selfLoop } = request;
  const compute = (): Output => {
    H.domain(!selfLoop || forwardPresent === reversePresent);
    return {
      reciprocal: forwardPresent && reversePresent,
      directedEdgeCount: selfLoop
        ? forwardPresent
          ? 1
          : 0
        : (forwardPresent ? 1 : 0) + (reversePresent ? 1 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { forwardPresent: true, reversePresent: true, selfLoop: false },
  output: { reciprocal: true, directedEdgeCount: 2 },
} satisfies ToolExample<Input, Output>;
export const edgeReciprocityIndicatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/edge-reciprocity-indicator",
    title: "Edge Reciprocity Indicator Tool",
    description:
      "Inspect one directed pair; a self-loop has identical forward/reverse flags and counts once.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forwardPresent: { type: "boolean" },
        reversePresent: { type: "boolean" },
        selfLoop: { type: "boolean" },
      },
      required: ["forwardPresent", "reversePresent", "selfLoop"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reciprocal: { type: "boolean" },
        directedEdgeCount: { type: "integer" },
      },
      required: ["reciprocal", "directedEdgeCount"],
    },
    ports: {
      inputs: [
        {
          id: "forwardPresent",
          label: "Forward Present",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "reversePresent",
          label: "Reverse Present",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "selfLoop",
          label: "Self Loop",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "reciprocal",
          label: "Reciprocal",
          valueType: { type: "boolean" },
        },
        {
          id: "directedEdgeCount",
          label: "Directed Edge Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = edgeReciprocityIndicatorTool.execute;
export default edgeReciprocityIndicatorTool;
