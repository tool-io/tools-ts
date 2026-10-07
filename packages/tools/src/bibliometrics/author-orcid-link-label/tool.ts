import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly authorDisplayName: string;
  readonly orcid: string;
};
export type Output = { readonly label: string; readonly url: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    authorDisplayName: { type: "string", maxLength: 8192, minLength: 1 },
    orcid: { type: "string", maxLength: 8192 },
  },
  required: ["authorDisplayName", "orcid"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    url: { type: "string", maxLength: 8192 },
  },
  required: ["label", "url"],
} as const;
/** Format an author label and ORCID URL after checking only the displayed identifier layout, without verifying checksum, ownership or registry existence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { authorDisplayName, orcid } = request;
  const compute = (): Output => {
    H.domain(authorDisplayName.length > 0, "authorDisplayName");
    H.domain(/^\d{4}-\d{4}-\d{4}-\d{3}[\dX](?![\s\S])/.test(orcid), "orcid");
    return {
      label: authorDisplayName + " [ORCID " + orcid + "]",
      url: "https://orcid.org/" + orcid,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { authorDisplayName: "A. Researcher", orcid: "0000-0002-1825-0097" },
  output: {
    label: "A. Researcher [ORCID 0000-0002-1825-0097]",
    url: "https://orcid.org/0000-0002-1825-0097",
  },
} satisfies ToolExample<Input, Output>;
export const authorOrcidLinkLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["bibliometrics", "research and quality management"],
      keywords: ["bibliometrics", "research and quality management"],
    },
    id: "bibliometrics/author-orcid-link-label",
    title: "Author ORCID Link Label",
    description:
      "Format an author label and ORCID URL after checking only the displayed identifier layout, without verifying checksum, ownership or registry existence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        authorDisplayName: { type: "string", maxLength: 8192, minLength: 1 },
        orcid: { type: "string", maxLength: 8192 },
      },
      required: ["authorDisplayName", "orcid"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        url: { type: "string", maxLength: 8192 },
      },
      required: ["label", "url"],
    },
    ports: {
      inputs: [
        {
          id: "authorDisplayName",
          label: "Author Display Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "orcid",
          label: "Orcid",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        { id: "url", label: "Url", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = authorOrcidLinkLabelTool.execute;
export default authorOrcidLinkLabelTool;
