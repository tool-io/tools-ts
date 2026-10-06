import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordEdition: string;
  readonly suppliedPagePrefix: string;
  readonly suppliedPageNumber: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordEdition: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPagePrefix: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPageNumber: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordEdition", "suppliedPagePrefix", "suppliedPageNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit Congressional Record page prefix and number without determining a chamber or publication date. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordEdition, suppliedPagePrefix, suppliedPageNumber } = request;
  const compute = (): Output => {
    H.domain(recordEdition.length > 0, "recordEdition");
    H.domain(suppliedPagePrefix.length > 0, "suppliedPagePrefix");
    H.domain(suppliedPageNumber.length > 0, "suppliedPageNumber");
    return {
      token: JSON.stringify([
        recordEdition,
        suppliedPagePrefix,
        suppliedPageNumber,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordEdition: "ED17",
    suppliedPagePrefix: "H",
    suppliedPageNumber: "0042",
  },
  output: { token: '["ED17","H","0042"]' },
} satisfies ToolExample<Input, Output>;
export const congressionalRecordPagePrefixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["american-studies", "american studies", "humanities"],
      keywords: ["american studies", "humanities"],
    },
    id: "american-studies/congressional-record-page-prefix",
    title: "Congressional Record Page Prefix",
    description:
      "Preserve an explicit Congressional Record page prefix and number without determining a chamber or publication date.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordEdition: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedPagePrefix: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedPageNumber: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordEdition", "suppliedPagePrefix", "suppliedPageNumber"],
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
          id: "recordEdition",
          label: "Record Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedPagePrefix",
          label: "Supplied Page Prefix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedPageNumber",
          label: "Supplied Page Number",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = congressionalRecordPagePrefixTool.execute;
export default congressionalRecordPagePrefixTool;
