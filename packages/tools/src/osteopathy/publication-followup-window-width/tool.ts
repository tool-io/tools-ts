import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly followupLower: number;
  readonly followupUpper: number;
  readonly suppliedTimeUnitFactor: number;
};
export type Output = { readonly width: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    followupLower: { type: "number" },
    followupUpper: { type: "number" },
    suppliedTimeUnitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["followupLower", "followupUpper", "suppliedTimeUnitFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "number" } },
  required: ["width"],
} as const;
/** Measure an explicitly supplied study follow-up interval without assessing treatment effects. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { followupLower, followupUpper, suppliedTimeUnitFactor } = request;
  const compute = (): Output => {
    H.domain(followupLower <= followupUpper);
    H.positive(suppliedTimeUnitFactor);
    return { width: (followupUpper - followupLower) * suppliedTimeUnitFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { followupLower: 10, followupUpper: 20, suppliedTimeUnitFactor: 2 },
  output: { width: 20 },
} satisfies ToolExample<Input, Output>;
export const publicationFollowupWindowWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "osteopathy/publication-followup-window-width",
    title: "Publication Followup Window Width Tool",
    description:
      "Measure an explicitly supplied study follow-up interval without assessing treatment effects.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        followupLower: { type: "number" },
        followupUpper: { type: "number" },
        suppliedTimeUnitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["followupLower", "followupUpper", "suppliedTimeUnitFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { width: { type: "number" } },
      required: ["width"],
    },
    ports: {
      inputs: [
        {
          id: "followupLower",
          label: "Followup Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "followupUpper",
          label: "Followup Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTimeUnitFactor",
          label: "Supplied Time Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "width", label: "Width", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = publicationFollowupWindowWidthTool.execute;
export default publicationFollowupWindowWidthTool;
