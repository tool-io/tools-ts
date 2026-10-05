import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly notBeforeYear: number;
  readonly notAfterYear: number;
};
export type Output = {
  readonly intervalLabel: string;
  readonly widthYears: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    notBeforeYear: { type: "integer", minimum: -100000, maximum: 100000 },
    notAfterYear: { type: "integer", maximum: 100000 },
  },
  required: ["notBeforeYear", "notAfterYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intervalLabel: { type: "string", maxLength: 8192 },
    widthYears: { type: "integer" },
  },
  required: ["intervalLabel", "widthYears"],
} as const;
/** Represent inclusive supplied historical year bounds with astronomical year numbering and their endpoint difference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { notBeforeYear, notAfterYear } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(notBeforeYear) &&
        notBeforeYear >= -100000 &&
        notBeforeYear <= 100000,
      "notBeforeYear",
    ),
      notBeforeYear);
    (H.domain(
      Number.isSafeInteger(notAfterYear) &&
        notAfterYear >= notBeforeYear &&
        notAfterYear <= 100000,
      "notAfterYear",
    ),
      notAfterYear);
    return {
      intervalLabel: "[" + notBeforeYear + ", " + notAfterYear + "]",
      widthYears: notAfterYear - notBeforeYear,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { notBeforeYear: 1450, notAfterYear: 1475 },
  output: { intervalLabel: "[1450, 1475]", widthYears: 25 },
} satisfies ToolExample<Input, Output>;
export const sourceDateNotBeforeNotAfterPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/source-date-not-before-not-after-pair",
    title: "Source Date Not Before Not After Pair Tool",
    description:
      "Represent inclusive supplied historical year bounds with astronomical year numbering and their endpoint difference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        notBeforeYear: { type: "integer", minimum: -100000, maximum: 100000 },
        notAfterYear: { type: "integer", maximum: 100000 },
      },
      required: ["notBeforeYear", "notAfterYear"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intervalLabel: { type: "string", maxLength: 8192 },
        widthYears: { type: "integer" },
      },
      required: ["intervalLabel", "widthYears"],
    },
    ports: {
      inputs: [
        {
          id: "notBeforeYear",
          label: "Not Before Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "notAfterYear",
          label: "Not After Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "intervalLabel",
          label: "Interval Label",
          valueType: { type: "string" },
        },
        {
          id: "widthYears",
          label: "Width Years",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = sourceDateNotBeforeNotAfterPairTool.execute;
export default sourceDateNotBeforeNotAfterPairTool;
