import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reasonText: string;
  readonly source: string;
  readonly locator: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reasonText: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    locator: { type: "string", maxLength: 8192 },
  },
  required: ["reasonText", "source", "locator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format an explicitly supplied public reason with source and locator, without establishing its validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reasonText, source, locator } = request;
  const compute = (): Output => {
    H.domain(
      reasonText.length > 0 && source.length > 0 && locator.length > 0,
      "reasonText",
    );
    return {
      label: JSON.stringify(reasonText) + " (" + source + ", " + locator + ")",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reasonText: "Access should be equal",
    source: "Policy paper",
    locator: "§2",
  },
  output: { label: '"Access should be equal" (Policy paper, §2)' },
} satisfies ToolExample<Input, Output>;
export const publicReasonSourceAttributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/public-reason-source-attribution",
    title: "Public Reason Source Attribution Tool",
    description:
      "Format an explicitly supplied public reason with source and locator, without establishing its validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reasonText: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        locator: { type: "string", maxLength: 8192 },
      },
      required: ["reasonText", "source", "locator"],
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
          id: "reasonText",
          label: "Reason Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
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
export const run = publicReasonSourceAttributionTool.execute;
export default publicReasonSourceAttributionTool;
