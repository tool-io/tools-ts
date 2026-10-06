import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceZeroDepth: number;
  readonly recordedDepth: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceZeroDepth: { type: "number" },
    recordedDepth: { type: "number" },
  },
  required: ["referenceZeroDepth", "recordedDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate signed cast depth relative to an explicit depth-zero reference without applying pressure-to-depth conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceZeroDepth, recordedDepth } = request;
  const compute = (): Output => {
    return { signedGap: recordedDepth - referenceZeroDepth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceZeroDepth: 12, recordedDepth: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const waterColumnCastDepthZeroShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "aquatic-science",
        "aquatic science",
        "earth and environmental sciences",
      ],
      keywords: ["aquatic science", "earth and environmental sciences"],
    },
    id: "aquatic-science/water-column-cast-depth-zero-shift",
    title: "Water Column Cast Depth Zero Shift",
    description:
      "Calculate signed cast depth relative to an explicit depth-zero reference without applying pressure-to-depth conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceZeroDepth: { type: "number" },
        recordedDepth: { type: "number" },
      },
      required: ["referenceZeroDepth", "recordedDepth"],
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
          id: "referenceZeroDepth",
          label: "Reference Zero Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedDepth",
          label: "Recorded Depth",
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
export const run = waterColumnCastDepthZeroShiftTool.execute;
export default waterColumnCastDepthZeroShiftTool;
