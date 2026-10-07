import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly volumeText: string; readonly issueText: string };
export type Output = { readonly display: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumeText: { type: "string", maxLength: 8192, minLength: 1 },
    issueText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["volumeText", "issueText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { display: { type: "string", maxLength: 8192 } },
  required: ["display"],
} as const;
/** Format supplied journal volume and issue text using explicit English volume and number prefixes without parsing identifiers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volumeText, issueText } = request;
  const compute = (): Output => {
    H.domain(volumeText.length > 0, "volumeText");
    H.domain(issueText.length > 0, "issueText");
    return { display: "vol. " + volumeText + ", no. " + issueText };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volumeText: "12", issueText: "3" },
  output: { display: "vol. 12, no. 3" },
} satisfies ToolExample<Input, Output>;
export const journalVolumeIssuePrefixTool = H.defineSchemaCalculation<
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
    id: "bibliometrics/journal-volume-issue-prefix",
    title: "Journal Volume Issue Prefix",
    description:
      "Format supplied journal volume and issue text using explicit English volume and number prefixes without parsing identifiers.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumeText: { type: "string", maxLength: 8192, minLength: 1 },
        issueText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["volumeText", "issueText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { display: { type: "string", maxLength: 8192 } },
      required: ["display"],
    },
    ports: {
      inputs: [
        {
          id: "volumeText",
          label: "Volume Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "issueText",
          label: "Issue Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "display", label: "Display", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = journalVolumeIssuePrefixTool.execute;
export default journalVolumeIssuePrefixTool;
