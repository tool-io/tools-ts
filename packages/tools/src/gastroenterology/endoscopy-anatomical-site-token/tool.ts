import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly procedureCode: string;
  readonly recordedSite: string;
  readonly siteSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    procedureCode: { type: "string", maxLength: 8192, minLength: 1 },
    recordedSite: { type: "string", maxLength: 8192, minLength: 1 },
    siteSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["procedureCode", "recordedSite", "siteSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicitly supplied endoscopy site and source without inferring anatomy or procedural adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { procedureCode, recordedSite, siteSource } = request;
  const compute = (): Output => {
    H.domain(procedureCode.length > 0, "procedureCode");
    H.domain(recordedSite.length > 0, "recordedSite");
    H.domain(siteSource.length > 0, "siteSource");
    return { token: JSON.stringify([procedureCode, recordedSite, siteSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    procedureCode: "END17",
    recordedSite: "site A",
    siteSource: "Procedure record",
  },
  output: { token: '["END17","site A","Procedure record"]' },
} satisfies ToolExample<Input, Output>;
export const endoscopyAnatomicalSiteTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gastroenterology", "health and medicine"],
      keywords: ["gastroenterology", "health and medicine"],
    },
    id: "gastroenterology/endoscopy-anatomical-site-token",
    title: "Endoscopy Anatomical Site Token",
    description:
      "Record an explicitly supplied endoscopy site and source without inferring anatomy or procedural adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        procedureCode: { type: "string", maxLength: 8192, minLength: 1 },
        recordedSite: { type: "string", maxLength: 8192, minLength: 1 },
        siteSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["procedureCode", "recordedSite", "siteSource"],
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
          id: "procedureCode",
          label: "Procedure Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedSite",
          label: "Recorded Site",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "siteSource",
          label: "Site Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = endoscopyAnatomicalSiteTokenTool.execute;
export default endoscopyAnatomicalSiteTokenTool;
