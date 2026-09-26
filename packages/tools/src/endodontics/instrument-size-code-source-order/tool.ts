import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly code: string;
  readonly sourceCodes: readonly string[];
  readonly sourceOrder: readonly number[];
};
export type Output = {
  readonly known: boolean;
  readonly ordinal: number;
  readonly duplicateSourceCodes: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    code: { type: "string", maxLength: 8192 },
    sourceCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceOrder: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["code", "sourceCodes", "sourceOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    known: { type: "boolean" },
    ordinal: { type: "integer" },
    duplicateSourceCodes: { type: "boolean" },
  },
  required: ["known", "ordinal", "duplicateSourceCodes"],
} as const;
/** Inspect caller-supplied size-code ordering, flagging ambiguous duplicate mappings without assuming an instrument standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { code, sourceCodes, sourceOrder } = request;
  const compute = (): Output => {
    H.sameLength(sourceCodes, sourceOrder);
    const i = sourceCodes.indexOf(code);
    return {
      known: i >= 0,
      ordinal: i >= 0 ? sourceOrder[i] : 0,
      duplicateSourceCodes: new Set(sourceCodes).size !== sourceCodes.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { code: "A", sourceCodes: ["B", "A"], sourceOrder: [10, 20] },
  output: { known: true, ordinal: 20, duplicateSourceCodes: false },
} satisfies ToolExample<Input, Output>;
export const instrumentSizeCodeSourceOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endodontics/instrument-size-code-source-order",
    title: "Instrument Size Code Source Order Tool",
    description:
      "Inspect caller-supplied size-code ordering, flagging ambiguous duplicate mappings without assuming an instrument standard.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        code: { type: "string", maxLength: 8192 },
        sourceCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceOrder: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["code", "sourceCodes", "sourceOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        known: { type: "boolean" },
        ordinal: { type: "integer" },
        duplicateSourceCodes: { type: "boolean" },
      },
      required: ["known", "ordinal", "duplicateSourceCodes"],
    },
    ports: {
      inputs: [
        {
          id: "code",
          label: "Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceCodes",
          label: "Source Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceOrder",
          label: "Source Order",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        { id: "known", label: "Known", valueType: { type: "boolean" } },
        { id: "ordinal", label: "Ordinal", valueType: { type: "integer" } },
        {
          id: "duplicateSourceCodes",
          label: "Duplicate Source Codes",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = instrumentSizeCodeSourceOrderTool.execute;
export default instrumentSizeCodeSourceOrderTool;
