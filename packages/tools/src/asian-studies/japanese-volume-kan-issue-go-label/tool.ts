import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly titleText: string;
  readonly volumeText: string;
  readonly issueText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    titleText: { type: "string", maxLength: 8192, minLength: 1 },
    volumeText: { type: "string", maxLength: 8192, minLength: 1 },
    issueText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["titleText", "volumeText", "issueText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format supplied Japanese volume and issue labels with 巻 and 号 without converting numeral systems or identifying a publication. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { titleText, volumeText, issueText } = request;
  const compute = (): Output => {
    H.domain(
      titleText.length > 0 && volumeText.length > 0 && issueText.length > 0,
      "titleText",
    );
    return {
      label: titleText + " 第" + volumeText + "巻 第" + issueText + "号",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { titleText: "題名", volumeText: "3", issueText: "2" },
  output: { label: "題名 第3巻 第2号" },
} satisfies ToolExample<Input, Output>;
export const japaneseVolumeKanIssueGoLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["asian-studies", "asian studies", "humanities"],
      keywords: ["asian studies", "humanities"],
    },
    id: "asian-studies/japanese-volume-kan-issue-go-label",
    title: "Japanese Volume Kan Issue Go Label",
    description:
      "Format supplied Japanese volume and issue labels with 巻 and 号 without converting numeral systems or identifying a publication.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        titleText: { type: "string", maxLength: 8192, minLength: 1 },
        volumeText: { type: "string", maxLength: 8192, minLength: 1 },
        issueText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["titleText", "volumeText", "issueText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "titleText",
          label: "Title Text",
          required: true,
          valueType: { type: "string" },
        },
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
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = japaneseVolumeKanIssueGoLabelTool.execute;
export default japaneseVolumeKanIssueGoLabelTool;
