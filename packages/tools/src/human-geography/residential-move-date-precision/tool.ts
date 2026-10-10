import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly moveId: string;
  readonly dateText: string;
  readonly precision: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moveId: { type: "string", maxLength: 8192, minLength: 1 },
    dateText: { type: "string", maxLength: 8192, minLength: 1 },
    precision: {
      type: "string",
      maxLength: 8192,
      enum: ["day", "month", "year", "approximate", "unknown"],
    },
  },
  required: ["moveId", "dateText", "precision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicitly supplied move-date text and precision without converting uncertain dates to exact timestamps. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { moveId, dateText, precision } = request;
  const compute = (): Output => {
    H.domain(moveId.length > 0 && dateText.length > 0, "moveId");
    H.domain(
      ["day", "month", "year", "approximate", "unknown"].includes(precision),
      "precision",
    );
    return {
      label:
        moveId +
        "; date=" +
        JSON.stringify(dateText) +
        "; precision=" +
        precision,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { moveId: "M17", dateText: "2026-10", precision: "month" },
  output: { label: 'M17; date="2026-10"; precision=month' },
} satisfies ToolExample<Input, Output>;
export const residentialMoveDatePrecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["human-geography", "human geography", "social sciences"],
      keywords: ["human geography", "social sciences"],
    },
    id: "human-geography/residential-move-date-precision",
    title: "Residential Move Date Precision",
    description:
      "Label explicitly supplied move-date text and precision without converting uncertain dates to exact timestamps.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        moveId: { type: "string", maxLength: 8192, minLength: 1 },
        dateText: { type: "string", maxLength: 8192, minLength: 1 },
        precision: {
          type: "string",
          maxLength: 8192,
          enum: ["day", "month", "year", "approximate", "unknown"],
        },
      },
      required: ["moveId", "dateText", "precision"],
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
          id: "moveId",
          label: "Move Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dateText",
          label: "Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "precision",
          label: "Precision",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = residentialMoveDatePrecisionTool.execute;
export default residentialMoveDatePrecisionTool;
