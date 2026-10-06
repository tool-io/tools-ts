import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceDepth: number;
  readonly markedDepth: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceDepth: { type: "number" },
    markedDepth: { type: "number" },
  },
  required: ["referenceDepth", "markedDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate signed marked cage depth minus supplied reference depth in consistent units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceDepth, markedDepth } = request;
  const compute = (): Output => {
    return { signedGap: markedDepth - referenceDepth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceDepth: 12, markedDepth: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const cageMarkedDepthOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaculture", "agriculture"],
      keywords: ["aquaculture", "agriculture"],
    },
    id: "aquaculture/cage-marked-depth-offset",
    title: "Cage Marked Depth Offset",
    description:
      "Calculate signed marked cage depth minus supplied reference depth in consistent units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceDepth: { type: "number" },
        markedDepth: { type: "number" },
      },
      required: ["referenceDepth", "markedDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "referenceDepth",
          label: "Reference Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "markedDepth",
          label: "Marked Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cageMarkedDepthOffsetTool.execute;
export default cageMarkedDepthOffsetTool;
