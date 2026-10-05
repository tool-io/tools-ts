import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly isoDate: string; readonly order: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isoDate: { type: "string", maxLength: 8192 },
    order: { type: "string", maxLength: 8192, enum: ["DMY", "MDY", "YMD"] },
  },
  required: ["isoDate", "order"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format an explicit Gregorian memorial date under a selected numeric field order without inferring a national convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { isoDate, order } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    namedDate(isoDate, "isoDate");
    H.domain(["DMY", "MDY", "YMD"].includes(order), "order");
    const [y, mo, d] = isoDate.split("-");
    return {
      label:
        order === "DMY"
          ? d + "/" + mo + "/" + y
          : order === "MDY"
            ? mo + "/" + d + "/" + y
            : y + "/" + mo + "/" + d,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { isoDate: "2026-11-01", order: "DMY" },
  output: { label: "01/11/2026" },
} satisfies ToolExample<Input, Output>;
export const memorialDateFormatConventionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/memorial-date-format-convention",
    title: "Memorial Date Format Convention Tool",
    description:
      "Format an explicit Gregorian memorial date under a selected numeric field order without inferring a national convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        isoDate: { type: "string", maxLength: 8192 },
        order: { type: "string", maxLength: 8192, enum: ["DMY", "MDY", "YMD"] },
      },
      required: ["isoDate", "order"],
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
          id: "isoDate",
          label: "Iso Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "order",
          label: "Order",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = memorialDateFormatConventionTool.execute;
export default memorialDateFormatConventionTool;
