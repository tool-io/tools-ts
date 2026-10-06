import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly copyText: string;
  readonly maximumCodePoints: number;
  readonly ellipsis: string;
};
export type Output = {
  readonly displayText: string;
  readonly truncated: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    copyText: { type: "string", maxLength: 8192 },
    maximumCodePoints: { type: "integer", minimum: 0 },
    ellipsis: { type: "string", maxLength: 8192 },
  },
  required: ["copyText", "maximumCodePoints", "ellipsis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    displayText: { type: "string", maxLength: 8192 },
    truncated: { type: "boolean" },
  },
  required: ["displayText", "truncated"],
} as const;
/** Truncate explicit ad copy to a supplied Unicode code-point budget reserving room for a supplied ellipsis without assuming grapheme or display width. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { copyText, maximumCodePoints, ellipsis } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(maximumCodePoints) &&
        maximumCodePoints >= 0 &&
        maximumCodePoints <= Number.MAX_SAFE_INTEGER,
      "maximumCodePoints",
    ),
      maximumCodePoints);
    return (() => {
      const points = Array.from(copyText),
        end = Array.from(ellipsis);
      if (points.length <= maximumCodePoints)
        return { displayText: copyText, truncated: false };
      H.domain(end.length <= maximumCodePoints, "ellipsis");
      return {
        displayText:
          points.slice(0, maximumCodePoints - end.length).join("") + ellipsis,
        truncated: true,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { copyText: "Hello world", maximumCodePoints: 8, ellipsis: "…" },
  output: { displayText: "Hello w…", truncated: true },
} satisfies ToolExample<Input, Output>;
export const adCopyTruncationEllipsisBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["advertising", "business and finance"],
      keywords: ["advertising", "business and finance"],
    },
    id: "advertising/ad-copy-truncation-ellipsis-budget",
    title: "Ad Copy Truncation Ellipsis Budget",
    description:
      "Truncate explicit ad copy to a supplied Unicode code-point budget reserving room for a supplied ellipsis without assuming grapheme or display width.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        copyText: { type: "string", maxLength: 8192 },
        maximumCodePoints: { type: "integer", minimum: 0 },
        ellipsis: { type: "string", maxLength: 8192 },
      },
      required: ["copyText", "maximumCodePoints", "ellipsis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        displayText: { type: "string", maxLength: 8192 },
        truncated: { type: "boolean" },
      },
      required: ["displayText", "truncated"],
    },
    ports: {
      inputs: [
        {
          id: "copyText",
          label: "Copy Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "maximumCodePoints",
          label: "Maximum Code Points",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "ellipsis",
          label: "Ellipsis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "displayText",
          label: "Display Text",
          valueType: { type: "string" },
        },
        { id: "truncated", label: "Truncated", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = adCopyTruncationEllipsisBudgetTool.execute;
export default adCopyTruncationEllipsisBudgetTool;
