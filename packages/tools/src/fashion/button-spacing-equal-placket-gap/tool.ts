import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstButtonPosition: number;
  readonly lastButtonPosition: number;
  readonly buttonCount: number;
};
export type Output = { readonly spacing: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstButtonPosition: { type: "number" },
    lastButtonPosition: { type: "number" },
    buttonCount: { type: "integer", minimum: 2 },
  },
  required: ["firstButtonPosition", "lastButtonPosition", "buttonCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { spacing: { type: "number" } },
  required: ["spacing"],
} as const;
/** Space at least two buttons uniformly between explicit first and last center positions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstButtonPosition, lastButtonPosition, buttonCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(buttonCount) &&
        buttonCount >= 2 &&
        buttonCount <= Number.MAX_SAFE_INTEGER,
      "buttonCount",
    ),
      buttonCount);
    H.domain(lastButtonPosition >= firstButtonPosition, "lastButtonPosition");
    return {
      spacing: (lastButtonPosition - firstButtonPosition) / (buttonCount - 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstButtonPosition: 2, lastButtonPosition: 32, buttonCount: 6 },
  output: { spacing: 6 },
} satisfies ToolExample<Input, Output>;
export const buttonSpacingEqualPlacketGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/button-spacing-equal-placket-gap",
    title: "Button Spacing Equal Placket Gap Tool",
    description:
      "Space at least two buttons uniformly between explicit first and last center positions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstButtonPosition: { type: "number" },
        lastButtonPosition: { type: "number" },
        buttonCount: { type: "integer", minimum: 2 },
      },
      required: ["firstButtonPosition", "lastButtonPosition", "buttonCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { spacing: { type: "number" } },
      required: ["spacing"],
    },
    ports: {
      inputs: [
        {
          id: "firstButtonPosition",
          label: "First Button Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lastButtonPosition",
          label: "Last Button Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "buttonCount",
          label: "Button Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "spacing", label: "Spacing", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = buttonSpacingEqualPlacketGapTool.execute;
export default buttonSpacingEqualPlacketGapTool;
