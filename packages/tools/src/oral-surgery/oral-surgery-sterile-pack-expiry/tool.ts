import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packId: string;
  readonly printedExpiryDate: string;
  readonly asOfDate: string;
};
export type Output = {
  readonly daysRemaining: number;
  readonly pastPrintedDate: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packId: { type: "string", maxLength: 8192, minLength: 1 },
    printedExpiryDate: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["packId", "printedExpiryDate", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    daysRemaining: { type: "number" },
    pastPrintedDate: { type: "boolean" },
  },
  required: ["daysRemaining", "pastPrintedDate"],
} as const;
/** Compare explicit pack expiry and as-of dates under an inclusive printed-date convention without certifying sterility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packId, printedExpiryDate, asOfDate } = request;
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
    H.domain(packId.length > 0, "packId");
    return (() => {
      const daysRemaining =
        (namedDate(printedExpiryDate, "printedExpiryDate").getTime() -
          namedDate(asOfDate, "asOfDate").getTime()) /
        86400000;
      return { daysRemaining, pastPrintedDate: daysRemaining < 0 };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    packId: "PK17",
    printedExpiryDate: "2026-11-05",
    asOfDate: "2026-11-01",
  },
  output: { daysRemaining: 4, pastPrintedDate: false },
} satisfies ToolExample<Input, Output>;
export const oralSurgerySterilepackExpiryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["oral-surgery", "oral surgery", "health and medicine"],
      keywords: ["oral surgery", "health and medicine"],
    },
    id: "oral-surgery/oral-surgery-sterile-pack-expiry",
    title: "Oral Surgery Sterile Pack Expiry",
    description:
      "Compare explicit pack expiry and as-of dates under an inclusive printed-date convention without certifying sterility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packId: { type: "string", maxLength: 8192, minLength: 1 },
        printedExpiryDate: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["packId", "printedExpiryDate", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        daysRemaining: { type: "number" },
        pastPrintedDate: { type: "boolean" },
      },
      required: ["daysRemaining", "pastPrintedDate"],
    },
    ports: {
      inputs: [
        {
          id: "packId",
          label: "Pack Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "printedExpiryDate",
          label: "Printed Expiry Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "asOfDate",
          label: "As Of Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "daysRemaining",
          label: "Days Remaining",
          valueType: { type: "number" },
        },
        {
          id: "pastPrintedDate",
          label: "Past Printed Date",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = oralSurgerySterilepackExpiryTool.execute;
export default oralSurgerySterilepackExpiryTool;
