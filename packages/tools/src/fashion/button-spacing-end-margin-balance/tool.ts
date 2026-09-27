import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingLength: number;
  readonly buttons: number;
  readonly spacing: number;
};
export type Output = { readonly endMargin: number; readonly feasible: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingLength: { type: "number", minimum: 0 },
    buttons: { type: "integer", minimum: 1 },
    spacing: { type: "number", minimum: 0 },
  },
  required: ["openingLength", "buttons", "spacing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { endMargin: { type: "number" }, feasible: { type: "boolean" } },
  required: ["endMargin", "feasible"],
} as const;
/** Calculate button spacing end margin balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingLength, buttons, spacing } = request;
  const compute = (): Output => {
    H.domain(openingLength >= 0 && spacing >= 0);
    H.integer(buttons, 1);
    return {
      endMargin: (openingLength - (buttons - 1) * spacing) / 2,
      feasible: openingLength >= (buttons - 1) * spacing,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingLength: 30, buttons: 6, spacing: 5 },
  output: { endMargin: 2.5, feasible: true },
} satisfies ToolExample<Input, Output>;
export const buttonSpacingEndMarginBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/button-spacing-end-margin-balance",
    title: "Button Spacing End Margin Balance Tool",
    description:
      "Calculate button spacing end margin balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingLength: { type: "number", minimum: 0 },
        buttons: { type: "integer", minimum: 1 },
        spacing: { type: "number", minimum: 0 },
      },
      required: ["openingLength", "buttons", "spacing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        endMargin: { type: "number" },
        feasible: { type: "boolean" },
      },
      required: ["endMargin", "feasible"],
    },
    ports: {
      inputs: [
        {
          id: "openingLength",
          label: "Opening Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "buttons",
          label: "Buttons",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "spacing",
          label: "Spacing",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "endMargin", label: "End Margin", valueType: { type: "number" } },
        { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = buttonSpacingEndMarginBalanceTool.execute;
export default buttonSpacingEndMarginBalanceTool;
