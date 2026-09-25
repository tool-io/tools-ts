import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedDepth: number;
  readonly referenceDepth: number;
  readonly positiveDown: boolean;
};
export type Output = { readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedDepth: { type: "number" },
    referenceDepth: { type: "number" },
    positiveDown: { type: "boolean" },
  },
  required: ["recordedDepth", "referenceDepth", "positiveDown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "number" } },
  required: ["offset"],
} as const;
/** Calculate core depth reference offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedDepth, referenceDepth, positiveDown } = request;
  const compute = (): Output => {
    return {
      offset: (recordedDepth - referenceDepth) * (positiveDown ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedDepth: 12, referenceDepth: 10, positiveDown: true },
  output: { offset: 2 },
} satisfies ToolExample<Input, Output>;
export const coreDepthReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/core-depth-reference-offset",
    title: "Core Depth Reference Offset Tool",
    description:
      "Calculate core depth reference offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedDepth: { type: "number" },
        referenceDepth: { type: "number" },
        positiveDown: { type: "boolean" },
      },
      required: ["recordedDepth", "referenceDepth", "positiveDown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offset: { type: "number" } },
      required: ["offset"],
    },
    ports: {
      inputs: [
        {
          id: "recordedDepth",
          label: "Recorded Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDepth",
          label: "Reference Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveDown",
          label: "Positive Down",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = coreDepthReferenceOffsetTool.execute;
export default coreDepthReferenceOffsetTool;
