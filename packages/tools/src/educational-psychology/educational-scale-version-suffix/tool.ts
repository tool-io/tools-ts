import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly scaleTitle: string; readonly version: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaleTitle: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["scaleTitle", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach an explicit educational-scale version suffix without identifying norms or treating versions as interchangeable. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scaleTitle, version } = request;
  const compute = (): Output => {
    H.domain(scaleTitle.length > 0 && version.length > 0, "scaleTitle");
    return { label: scaleTitle + " [" + version + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scaleTitle: "Learning survey", version: "v2" },
  output: { label: "Learning survey [v2]" },
} satisfies ToolExample<Input, Output>;
export const educationalScaleVersionSuffixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "educational-psychology",
        "educational psychology",
        "psychology",
      ],
      keywords: ["educational psychology", "psychology"],
    },
    id: "educational-psychology/educational-scale-version-suffix",
    title: "Educational Scale Version Suffix",
    description:
      "Attach an explicit educational-scale version suffix without identifying norms or treating versions as interchangeable.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaleTitle: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["scaleTitle", "version"],
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
          id: "scaleTitle",
          label: "Scale Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = educationalScaleVersionSuffixTool.execute;
export default educationalScaleVersionSuffixTool;
