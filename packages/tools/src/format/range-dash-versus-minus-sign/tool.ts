import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startText: string;
  readonly endText: string;
  readonly useEnDash: boolean;
};
export type Output = { readonly formattedRange: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startText: { type: "string", maxLength: 8192, minLength: 1 },
    endText: { type: "string", maxLength: 8192, minLength: 1 },
    useEnDash: { type: "boolean" },
  },
  required: ["startText", "endText", "useEnDash"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { formattedRange: { type: "string", maxLength: 8192 } },
  required: ["formattedRange"],
} as const;
/** Join explicit range endpoint text using an en dash or word separator while preserving endpoint minus signs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startText, endText, useEnDash } = request;
  const compute = (): Output => {
    H.domain(startText.length > 0 && endText.length > 0, "startText");
    return { formattedRange: startText + (useEnDash ? "–" : " to ") + endText };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startText: "−5", endText: "−2", useEnDash: true },
  output: { formattedRange: "−5–−2" },
} satisfies ToolExample<Input, Output>;
export const rangeDashVersusMinusSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["format", "data formatting", "computer science"],
      keywords: ["data formatting", "computer science"],
    },
    id: "format/range-dash-versus-minus-sign",
    title: "Range Dash Versus Minus Sign",
    description:
      "Join explicit range endpoint text using an en dash or word separator while preserving endpoint minus signs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startText: { type: "string", maxLength: 8192, minLength: 1 },
        endText: { type: "string", maxLength: 8192, minLength: 1 },
        useEnDash: { type: "boolean" },
      },
      required: ["startText", "endText", "useEnDash"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { formattedRange: { type: "string", maxLength: 8192 } },
      required: ["formattedRange"],
    },
    ports: {
      inputs: [
        {
          id: "startText",
          label: "Start Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "endText",
          label: "End Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "useEnDash",
          label: "Use En Dash",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "formattedRange",
          label: "Formatted Range",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = rangeDashVersusMinusSignTool.execute;
export default rangeDashVersusMinusSignTool;
