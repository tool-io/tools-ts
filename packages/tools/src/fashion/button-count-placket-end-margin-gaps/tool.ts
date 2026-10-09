import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly placketLength: number;
  readonly firstEndMargin: number;
  readonly lastEndMargin: number;
  readonly buttonCount: number;
};
export type Output = { readonly equalGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    placketLength: { type: "number", minimum: 0 },
    firstEndMargin: { type: "number", minimum: 0 },
    lastEndMargin: { type: "number", minimum: 0 },
    buttonCount: { type: "integer", minimum: 2 },
  },
  required: ["placketLength", "firstEndMargin", "lastEndMargin", "buttonCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equalGap: { type: "number" } },
  required: ["equalGap"],
} as const;
/** Divide explicit usable placket length into equal spaces between at least two buttons without choosing button counts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { placketLength, firstEndMargin, lastEndMargin, buttonCount } = request;
  const compute = (): Output => {
    H.domain(
      placketLength >= 0 &&
        firstEndMargin >= 0 &&
        lastEndMargin >= 0 &&
        firstEndMargin + lastEndMargin <= placketLength,
      "placketLength",
    );
    (H.domain(
      Number.isSafeInteger(buttonCount) &&
        buttonCount >= 2 &&
        buttonCount <= Number.MAX_SAFE_INTEGER,
      "buttonCount",
    ),
      buttonCount);
    return {
      equalGap:
        (placketLength - firstEndMargin - lastEndMargin) / (buttonCount - 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    placketLength: 200,
    firstEndMargin: 20,
    lastEndMargin: 20,
    buttonCount: 5,
  },
  output: { equalGap: 40 },
} satisfies ToolExample<Input, Output>;
export const buttoncountPlacketEndmarginGapsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["fashion", "arts and design"],
      keywords: ["fashion", "arts and design"],
    },
    id: "fashion/button-count-placket-end-margin-gaps",
    title: "Button Count and Placket End Margin Gaps",
    description:
      "Divide explicit usable placket length into equal spaces between at least two buttons without choosing button counts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        placketLength: { type: "number", minimum: 0 },
        firstEndMargin: { type: "number", minimum: 0 },
        lastEndMargin: { type: "number", minimum: 0 },
        buttonCount: { type: "integer", minimum: 2 },
      },
      required: [
        "placketLength",
        "firstEndMargin",
        "lastEndMargin",
        "buttonCount",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { equalGap: { type: "number" } },
      required: ["equalGap"],
    },
    ports: {
      inputs: [
        {
          id: "placketLength",
          label: "Placket Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstEndMargin",
          label: "First End Margin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lastEndMargin",
          label: "Last End Margin",
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
        { id: "equalGap", label: "Equal Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = buttoncountPlacketEndmarginGapsTool.execute;
export default buttoncountPlacketEndmarginGapsTool;
