import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly indicator: string };
export type Output = { readonly displayToken: string; readonly blank: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { indicator: { type: "string", maxLength: 8192 } },
  required: ["indicator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    displayToken: { type: "string", maxLength: 8192 },
    blank: { type: "boolean" },
  },
  required: ["displayToken", "blank"],
} as const;
/** Display a MARC indicator blank as # while preserving one permitted nonblank indicator character; no field-specific indicator meaning is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { indicator } = request;
  const compute = (): Output => {
    H.domain(
      indicator.length === 1 && /^[ 0-9a-z](?![\s\S])/.test(indicator),
      "indicator",
    );
    return {
      displayToken: indicator === " " ? "#" : indicator,
      blank: indicator === " ",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { indicator: " " },
  output: { displayToken: "#", blank: true },
} satisfies ToolExample<Input, Output>;
export const marcIndicatorBlankTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/marc-indicator-blank-token",
    title: "Marc Indicator Blank Token Tool",
    description:
      "Display a MARC indicator blank as # while preserving one permitted nonblank indicator character; no field-specific indicator meaning is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { indicator: { type: "string", maxLength: 8192 } },
      required: ["indicator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        displayToken: { type: "string", maxLength: 8192 },
        blank: { type: "boolean" },
      },
      required: ["displayToken", "blank"],
    },
    ports: {
      inputs: [
        {
          id: "indicator",
          label: "Indicator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "displayToken",
          label: "Display Token",
          valueType: { type: "string" },
        },
        { id: "blank", label: "Blank", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = marcIndicatorBlankTokenTool.execute;
export default marcIndicatorBlankTokenTool;
