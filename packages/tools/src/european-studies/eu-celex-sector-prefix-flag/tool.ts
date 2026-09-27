import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly identifier: string;
  readonly allowedSectors: readonly string[];
};
export type Output = { readonly prefix: string; readonly permitted: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identifier: { type: "string", maxLength: 8192 },
    allowedSectors: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["identifier", "allowedSectors"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefix: { type: "string", maxLength: 8192 },
    permitted: { type: "boolean" },
  },
  required: ["prefix", "permitted"],
} as const;
/** Compare a supplied CELEX leading sector token with an explicit allowed set; does not validate the document identifier. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { identifier, allowedSectors } = request;
  const compute = (): Output => {
    H.domain(identifier.length > 0);
    const prefix = identifier[0];
    return { prefix, permitted: allowedSectors.includes(prefix) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { identifier: "32016R0679", allowedSectors: ["0", "1", "2", "3"] },
  output: { prefix: "3", permitted: true },
} satisfies ToolExample<Input, Output>;
export const euCelexSectorPrefixFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "european-studies/eu-celex-sector-prefix-flag",
    title: "Eu Celex Sector Prefix Flag Tool",
    description:
      "Compare a supplied CELEX leading sector token with an explicit allowed set; does not validate the document identifier.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        identifier: { type: "string", maxLength: 8192 },
        allowedSectors: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["identifier", "allowedSectors"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefix: { type: "string", maxLength: 8192 },
        permitted: { type: "boolean" },
      },
      required: ["prefix", "permitted"],
    },
    ports: {
      inputs: [
        {
          id: "identifier",
          label: "Identifier",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedSectors",
          label: "Allowed Sectors",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "prefix", label: "Prefix", valueType: { type: "string" } },
        { id: "permitted", label: "Permitted", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = euCelexSectorPrefixFlagTool.execute;
export default euCelexSectorPrefixFlagTool;
