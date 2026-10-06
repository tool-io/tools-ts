import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceTitle: string;
  readonly edition: string;
  readonly locator: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceTitle: { type: "string", maxLength: 8192, minLength: 1 },
    edition: { type: "string", maxLength: 8192, minLength: 1 },
    locator: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceTitle", "edition", "locator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format an explicit ethical-source edition and locator without treating it as an applicable binding rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceTitle, edition, locator } = request;
  const compute = (): Output => {
    H.domain(
      sourceTitle.length > 0 && edition.length > 0 && locator.length > 0,
      "sourceTitle",
    );
    return { label: sourceTitle + " [" + edition + "], " + locator };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceTitle: "Ethics guide", edition: "v2", locator: "§4" },
  output: { label: "Ethics guide [v2], §4" },
} satisfies ToolExample<Input, Output>;
export const ethicalSourceEditionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["applied-ethics", "applied ethics", "philosophy"],
      keywords: ["applied ethics", "philosophy"],
    },
    id: "applied-ethics/ethical-source-edition-label",
    title: "Ethical Source Edition Label",
    description:
      "Format an explicit ethical-source edition and locator without treating it as an applicable binding rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceTitle: { type: "string", maxLength: 8192, minLength: 1 },
        edition: { type: "string", maxLength: 8192, minLength: 1 },
        locator: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sourceTitle", "edition", "locator"],
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
          id: "sourceTitle",
          label: "Source Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "locator",
          label: "Locator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ethicalSourceEditionLabelTool.execute;
export default ethicalSourceEditionLabelTool;
