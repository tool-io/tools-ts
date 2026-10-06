import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedPlaceName: string;
  readonly suppliedDateText: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPlaceName: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedDateText: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedPlaceName", "suppliedDateText", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit place, date and source wording without determining historical territorial jurisdiction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedPlaceName, suppliedDateText, source } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedPlaceName.length > 0, "suppliedPlaceName");
    H.domain(suppliedDateText.length > 0, "suppliedDateText");
    H.domain(source.length > 0, "source");
    return {
      token: JSON.stringify([
        recordId,
        suppliedPlaceName,
        suppliedDateText,
        source,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedPlaceName: "Place A",
    suppliedDateText: "1850",
    source: "Source A",
  },
  output: { token: '["R17","Place A","1850","Source A"]' },
} satisfies ToolExample<Input, Output>;
export const usTerritorialPlaceDateSourceTagTool = H.defineSchemaCalculation<
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
    id: "american-studies/us-territorial-place-date-source-tag",
    title: "US Territorial Place Date Source Tag",
    description:
      "Preserve explicit place, date and source wording without determining historical territorial jurisdiction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedPlaceName: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedDateText: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "suppliedPlaceName", "suppliedDateText", "source"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedPlaceName",
          label: "Supplied Place Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedDateText",
          label: "Supplied Date Text",
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
export const run = usTerritorialPlaceDateSourceTagTool.execute;
export default usTerritorialPlaceDateSourceTagTool;
