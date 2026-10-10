import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fishLength: number;
  readonly lowerEdge: number;
  readonly upperEdge: number;
  readonly includeUpper: boolean;
};
export type Output = { readonly inside: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fishLength: { type: "number", minimum: 0 },
    lowerEdge: { type: "number", minimum: 0 },
    upperEdge: { type: "number" },
    includeUpper: { type: "boolean" },
  },
  required: ["fishLength", "lowerEdge", "upperEdge", "includeUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inside: { type: "boolean" } },
  required: ["inside"],
} as const;
/** Check a supplied fish length against explicit bin boundaries and a caller-selected upper-edge convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fishLength, lowerEdge, upperEdge, includeUpper } = request;
  const compute = (): Output => {
    H.domain(
      fishLength >= 0 && lowerEdge >= 0 && upperEdge > lowerEdge,
      "fishLength",
    );
    return {
      inside:
        fishLength >= lowerEdge &&
        (includeUpper ? fishLength <= upperEdge : fishLength < upperEdge),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fishLength: 15, lowerEdge: 10, upperEdge: 20, includeUpper: false },
  output: { inside: true },
} satisfies ToolExample<Input, Output>;
export const fishLengthFrequencyBinTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["ichthyology", "biology"],
      keywords: ["ichthyology", "biology"],
    },
    id: "ichthyology/fish-length-frequency-bin",
    title: "Fish Length Frequency Bin",
    description:
      "Check a supplied fish length against explicit bin boundaries and a caller-selected upper-edge convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fishLength: { type: "number", minimum: 0 },
        lowerEdge: { type: "number", minimum: 0 },
        upperEdge: { type: "number" },
        includeUpper: { type: "boolean" },
      },
      required: ["fishLength", "lowerEdge", "upperEdge", "includeUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inside: { type: "boolean" } },
      required: ["inside"],
    },
    ports: {
      inputs: [
        {
          id: "fishLength",
          label: "Fish Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerEdge",
          label: "Lower Edge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperEdge",
          label: "Upper Edge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeUpper",
          label: "Include Upper",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = fishLengthFrequencyBinTool.execute;
export default fishLengthFrequencyBinTool;
