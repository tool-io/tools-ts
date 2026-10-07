import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tokenText: string;
  readonly suppliedBoundaryMarker: string;
};
export type Output = {
  readonly hasMarker: boolean;
  readonly unmarkedText: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokenText: { type: "string", maxLength: 8192 },
    suppliedBoundaryMarker: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["tokenText", "suppliedBoundaryMarker"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hasMarker: { type: "boolean" },
    unmarkedText: { type: "string", maxLength: 8192 },
  },
  required: ["hasMarker", "unmarkedText"],
} as const;
/** Remove one supplied literal leading subword boundary marker when present without selecting a tokenizer dialect. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tokenText, suppliedBoundaryMarker } = request;
  const compute = (): Output => {
    H.domain(suppliedBoundaryMarker.length > 0, "suppliedBoundaryMarker");
    return {
      hasMarker: tokenText.startsWith(suppliedBoundaryMarker),
      unmarkedText: tokenText.startsWith(suppliedBoundaryMarker)
        ? tokenText.slice(suppliedBoundaryMarker.length)
        : tokenText,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tokenText: "▁hello", suppliedBoundaryMarker: "▁" },
  output: { hasMarker: true, unmarkedText: "hello" },
} satisfies ToolExample<Input, Output>;
export const subwordWordBoundaryMarkerTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "computational-linguistics",
        "computational linguistics",
        "information and language sciences",
      ],
      keywords: [
        "computational linguistics",
        "information and language sciences",
      ],
    },
    id: "computational-linguistics/subword-word-boundary-marker-token",
    title: "Subword Word Boundary Marker Token",
    description:
      "Remove one supplied literal leading subword boundary marker when present without selecting a tokenizer dialect.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokenText: { type: "string", maxLength: 8192 },
        suppliedBoundaryMarker: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: ["tokenText", "suppliedBoundaryMarker"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hasMarker: { type: "boolean" },
        unmarkedText: { type: "string", maxLength: 8192 },
      },
      required: ["hasMarker", "unmarkedText"],
    },
    ports: {
      inputs: [
        {
          id: "tokenText",
          label: "Token Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedBoundaryMarker",
          label: "Supplied Boundary Marker",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "hasMarker",
          label: "Has Marker",
          valueType: { type: "boolean" },
        },
        {
          id: "unmarkedText",
          label: "Unmarked Text",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = subwordWordBoundaryMarkerTokenTool.execute;
export default subwordWordBoundaryMarkerTokenTool;
