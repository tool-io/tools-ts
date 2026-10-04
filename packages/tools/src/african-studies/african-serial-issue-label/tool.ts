import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly serialTitle: string;
  readonly volumeText: string;
  readonly issueText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    serialTitle: { type: "string", maxLength: 8192 },
    volumeText: { type: "string", maxLength: 8192 },
    issueText: { type: "string", maxLength: 8192 },
  },
  required: ["serialTitle", "volumeText", "issueText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format literal serial title, volume and issue display fields without recoding local enumeration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { serialTitle, volumeText, issueText } = request;
  const compute = (): Output => {
    H.domain(
      serialTitle.length > 0 && volumeText.length > 0 && issueText.length > 0,
      "serialTitle",
    );
    return {
      label: serialTitle + ", vol. " + volumeText + ", no. " + issueText,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { serialTitle: "Journal A", volumeText: "12", issueText: "3" },
  output: { label: "Journal A, vol. 12, no. 3" },
} satisfies ToolExample<Input, Output>;
export const africanSerialIssueLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "african-studies/african-serial-issue-label",
    title: "African Serial Issue Label Tool",
    description:
      "Format literal serial title, volume and issue display fields without recoding local enumeration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        serialTitle: { type: "string", maxLength: 8192 },
        volumeText: { type: "string", maxLength: 8192 },
        issueText: { type: "string", maxLength: 8192 },
      },
      required: ["serialTitle", "volumeText", "issueText"],
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
          id: "serialTitle",
          label: "Serial Title",
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
export const run = africanSerialIssueLabelTool.execute;
export default africanSerialIssueLabelTool;
