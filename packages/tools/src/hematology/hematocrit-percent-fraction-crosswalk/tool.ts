import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly inputIsPercent: boolean;
};
export type Output = { readonly fraction: number; readonly percent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number", minimum: 0 },
    inputIsPercent: { type: "boolean" },
  },
  required: ["value", "inputIsPercent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, percent: { type: "number" } },
  required: ["fraction", "percent"],
} as const;
/** Convert an explicit hematocrit value between fraction and percent without assessing a clinical range. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, inputIsPercent } = request;
  const compute = (): Output => {
    H.domain(value >= 0 && value <= (inputIsPercent ? 100 : 1), "value");
    return {
      fraction: inputIsPercent ? value / 100 : value,
      percent: inputIsPercent ? value : value * 100,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 42, inputIsPercent: true },
  output: { fraction: 0.42, percent: 42 },
} satisfies ToolExample<Input, Output>;
export const hematocritPercentFractionCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hematology", "health and medicine"],
      keywords: ["hematology", "health and medicine"],
    },
    id: "hematology/hematocrit-percent-fraction-crosswalk",
    title: "Hematocrit Percent Fraction Crosswalk",
    description:
      "Convert an explicit hematocrit value between fraction and percent without assessing a clinical range.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number", minimum: 0 },
        inputIsPercent: { type: "boolean" },
      },
      required: ["value", "inputIsPercent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fraction: { type: "number" }, percent: { type: "number" } },
      required: ["fraction", "percent"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputIsPercent",
          label: "Input Is Percent",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "percent", label: "Percent", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hematocritPercentFractionCrosswalkTool.execute;
export default hematocritPercentFractionCrosswalkTool;
