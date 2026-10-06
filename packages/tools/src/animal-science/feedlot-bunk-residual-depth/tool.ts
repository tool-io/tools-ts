import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceDepth: number;
  readonly measuredDepth: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceDepth: { type: "number" },
    measuredDepth: { type: "number" },
  },
  required: ["referenceDepth", "measuredDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate signed measured-minus-reference feed-bunk depth without converting depth to feed quantity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceDepth, measuredDepth } = request;
  const compute = (): Output => {
    return { signedGap: measuredDepth - referenceDepth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceDepth: 12, measuredDepth: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const feedlotBunkResidualDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["animal-science", "animal science", "agriculture"],
      keywords: ["animal science", "agriculture"],
    },
    id: "animal-science/feedlot-bunk-residual-depth",
    title: "Feedlot Bunk Residual Depth",
    description:
      "Calculate signed measured-minus-reference feed-bunk depth without converting depth to feed quantity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceDepth: { type: "number" },
        measuredDepth: { type: "number" },
      },
      required: ["referenceDepth", "measuredDepth"],
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
          id: "measuredDepth",
          label: "Measured Depth",
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
export const run = feedlotBunkResidualDepthTool.execute;
export default feedlotBunkResidualDepthTool;
