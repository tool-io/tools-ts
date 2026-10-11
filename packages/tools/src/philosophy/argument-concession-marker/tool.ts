import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly argumentId: string;
  readonly suppliedConcessionText: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    argumentId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedConcessionText: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["argumentId", "suppliedConcessionText", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit argument concession annotation without assessing validity or agreement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { argumentId, suppliedConcessionText, source } = request;
  const compute = (): Output => {
    H.domain(argumentId.length > 0, "argumentId");
    H.domain(suppliedConcessionText.length > 0, "suppliedConcessionText");
    H.domain(source.length > 0, "source");
    return {
      token: JSON.stringify([argumentId, suppliedConcessionText, source]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    argumentId: "ARG17",
    suppliedConcessionText: "Granted premise A",
    source: "Source A",
  },
  output: { token: '["ARG17","Granted premise A","Source A"]' },
} satisfies ToolExample<Input, Output>;
export const argumentConcessionMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["philosophy"],
      keywords: ["philosophy"],
    },
    id: "philosophy/argument-concession-marker",
    title: "Argument Concession Marker",
    description:
      "Preserve an explicit argument concession annotation without assessing validity or agreement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        argumentId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedConcessionText: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["argumentId", "suppliedConcessionText", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "argumentId",
          label: "Argument Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedConcessionText",
          label: "Supplied Concession Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = argumentConcessionMarkerTool.execute;
export default argumentConcessionMarkerTool;
