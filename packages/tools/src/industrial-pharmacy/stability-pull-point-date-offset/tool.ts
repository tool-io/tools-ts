import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceDate: string;
  readonly offsetDays: number;
};
export type Output = { readonly pullDate: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceDate: { type: "string", maxLength: 8192 },
    offsetDays: { type: "integer" },
  },
  required: ["referenceDate", "offsetDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pullDate: { type: "string", maxLength: 8192 } },
  required: ["pullDate"],
} as const;
/** Apply an explicit calendar-day offset to a stability reference date without choosing a stability schedule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceDate, offsetDays } = request;
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
    (H.domain(
      Number.isSafeInteger(offsetDays) &&
        offsetDays >= -Number.MAX_SAFE_INTEGER &&
        offsetDays <= Number.MAX_SAFE_INTEGER,
      "offsetDays",
    ),
      offsetDays);
    return {
      pullDate: (() => {
        const d = namedDate(referenceDate, "referenceDate");
        d.setUTCDate(d.getUTCDate() + offsetDays);
        H.domain(
          Number.isFinite(d.getTime()) &&
            d.getUTCFullYear() >= 0 &&
            d.getUTCFullYear() <= 9999,
          "offsetDays",
        );
        return d.toISOString().slice(0, 10);
      })(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceDate: "2026-10-28", offsetDays: 4 },
  output: { pullDate: "2026-11-01" },
} satisfies ToolExample<Input, Output>;
export const stabilityPullPointDateOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["industrial-pharmacy", "industrial pharmacy", "pharmacy"],
      keywords: ["industrial pharmacy", "pharmacy"],
    },
    id: "industrial-pharmacy/stability-pull-point-date-offset",
    title: "Stability Pull Point Date Offset",
    description:
      "Apply an explicit calendar-day offset to a stability reference date without choosing a stability schedule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceDate: { type: "string", maxLength: 8192 },
        offsetDays: { type: "integer" },
      },
      required: ["referenceDate", "offsetDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { pullDate: { type: "string", maxLength: 8192 } },
      required: ["pullDate"],
    },
    ports: {
      inputs: [
        {
          id: "referenceDate",
          label: "Reference Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "offsetDays",
          label: "Offset Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "pullDate", label: "Pull Date", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = stabilityPullPointDateOffsetTool.execute;
export default stabilityPullPointDateOffsetTool;
