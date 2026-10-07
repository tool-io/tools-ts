import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedCode: string;
  readonly allowedCodes: readonly string[];
  readonly missingCode: string;
};
export type Output = {
  readonly recognized: boolean;
  readonly missing: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedCode: { type: "string", maxLength: 8192 },
    allowedCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingCode: { type: "string", maxLength: 8192 },
  },
  required: ["recordedCode", "allowedCodes", "missingCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recognized: { type: "boolean" }, missing: { type: "boolean" } },
  required: ["recognized", "missing"],
} as const;
/** Compare a literal dominance response with an explicit codebook without assigning cover classes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedCode, allowedCodes, missingCode } = request;
  const compute = (): Output => {
    H.domain(!allowedCodes.includes(missingCode), "allowedCodes");
    return {
      recognized: allowedCodes.includes(recordedCode),
      missing: recordedCode === missingCode,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedCode: "D", allowedCodes: ["D", "S"], missingCode: "M" },
  output: { recognized: true, missing: false },
} satisfies ToolExample<Input, Output>;
export const plantCoverDominanceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["botany", "biology"],
      keywords: ["botany", "biology"],
    },
    id: "botany/plant-cover-dominance-code",
    title: "Plant Cover Dominance Code",
    description:
      "Compare a literal dominance response with an explicit codebook without assigning cover classes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedCode: { type: "string", maxLength: 8192 },
        allowedCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        missingCode: { type: "string", maxLength: 8192 },
      },
      required: ["recordedCode", "allowedCodes", "missingCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognized: { type: "boolean" },
        missing: { type: "boolean" },
      },
      required: ["recognized", "missing"],
    },
    ports: {
      inputs: [
        {
          id: "recordedCode",
          label: "Recorded Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedCodes",
          label: "Allowed Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "missingCode",
          label: "Missing Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
        { id: "missing", label: "Missing", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = plantCoverDominanceCodeTool.execute;
export default plantCoverDominanceCodeTool;
