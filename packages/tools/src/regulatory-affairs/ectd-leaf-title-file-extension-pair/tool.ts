import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly title: string;
  readonly filename: string;
  readonly allowedExtensions: readonly string[];
};
export type Output = {
  readonly extension: string;
  readonly allowed: boolean;
  readonly titlePresent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string", maxLength: 8192 },
    filename: { type: "string", maxLength: 8192 },
    allowedExtensions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["title", "filename", "allowedExtensions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extension: { type: "string", maxLength: 8192 },
    allowed: { type: "boolean" },
    titlePresent: { type: "boolean" },
  },
  required: ["extension", "allowed", "titlePresent"],
} as const;
/** Inspect supplied leaf-title presence and filename extension under an explicit list. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { title, filename, allowedExtensions } = request;
  const compute = (): Output => {
    H.domain(filename.length > 0 && !/[\\/]/.test(filename), "filename");
    const dot = filename.lastIndexOf("."),
      extension = dot > 0 ? filename.slice(dot + 1).toLowerCase() : "";
    return {
      extension,
      allowed: allowedExtensions
        .map((x) => x.toLowerCase())
        .includes(extension),
      titlePresent: title.trim().length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    title: "Study report",
    filename: "report.PDF",
    allowedExtensions: ["pdf", "xml"],
  },
  output: { extension: "pdf", allowed: true, titlePresent: true },
} satisfies ToolExample<Input, Output>;
export const ectdLeafTitleFileExtensionPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "regulatory-affairs/ectd-leaf-title-file-extension-pair",
    title: "eCTD Leaf Title File Extension Pair Tool",
    description:
      "Inspect supplied leaf-title presence and filename extension under an explicit list.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string", maxLength: 8192 },
        filename: { type: "string", maxLength: 8192 },
        allowedExtensions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["title", "filename", "allowedExtensions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        extension: { type: "string", maxLength: 8192 },
        allowed: { type: "boolean" },
        titlePresent: { type: "boolean" },
      },
      required: ["extension", "allowed", "titlePresent"],
    },
    ports: {
      inputs: [
        {
          id: "title",
          label: "Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "filename",
          label: "Filename",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedExtensions",
          label: "Allowed Extensions",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "extension", label: "Extension", valueType: { type: "string" } },
        { id: "allowed", label: "Allowed", valueType: { type: "boolean" } },
        {
          id: "titlePresent",
          label: "Title Present",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = ectdLeafTitleFileExtensionPairTool.execute;
export default ectdLeafTitleFileExtensionPairTool;
