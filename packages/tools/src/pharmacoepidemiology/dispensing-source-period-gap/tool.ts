import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dispensingDate: string;
  readonly sourceStartDate: string;
  readonly sourceEndDate: string;
  readonly endInclusive: boolean;
};
export type Output = {
  readonly daysFromStart: number;
  readonly daysToEnd: number;
  readonly sourceCoversDate: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dispensingDate: { type: "string", maxLength: 8192 },
    sourceStartDate: { type: "string", maxLength: 8192 },
    sourceEndDate: { type: "string", maxLength: 8192 },
    endInclusive: { type: "boolean" },
  },
  required: [
    "dispensingDate",
    "sourceStartDate",
    "sourceEndDate",
    "endInclusive",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    daysFromStart: { type: "integer" },
    daysToEnd: { type: "integer" },
    sourceCoversDate: { type: "boolean" },
  },
  required: ["daysFromStart", "daysToEnd", "sourceCoversDate"],
} as const;
/** Calculate dispensing source period gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dispensingDate, sourceStartDate, sourceEndDate, endInclusive } =
    request;
  const compute = (): Output => {
    return (() => {
      const a = H.dateOnly(dispensingDate).getTime(),
        b = H.dateOnly(sourceStartDate).getTime(),
        c = H.dateOnly(sourceEndDate).getTime();
      H.domain(c >= b);
      return {
        daysFromStart: (a - b) / 86400000,
        daysToEnd: (c - a) / 86400000,
        sourceCoversDate: a >= b && (endInclusive ? a <= c : a < c),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dispensingDate: "2024-01-05",
    sourceStartDate: "2024-01-01",
    sourceEndDate: "2024-01-10",
    endInclusive: false,
  },
  output: { daysFromStart: 4, daysToEnd: 5, sourceCoversDate: true },
} satisfies ToolExample<Input, Output>;
export const dispensingSourcePeriodGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacoepidemiology/dispensing-source-period-gap",
    title: "Dispensing Source Period Gap Tool",
    description:
      "Calculate dispensing source period gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dispensingDate: { type: "string", maxLength: 8192 },
        sourceStartDate: { type: "string", maxLength: 8192 },
        sourceEndDate: { type: "string", maxLength: 8192 },
        endInclusive: { type: "boolean" },
      },
      required: [
        "dispensingDate",
        "sourceStartDate",
        "sourceEndDate",
        "endInclusive",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        daysFromStart: { type: "integer" },
        daysToEnd: { type: "integer" },
        sourceCoversDate: { type: "boolean" },
      },
      required: ["daysFromStart", "daysToEnd", "sourceCoversDate"],
    },
    ports: {
      inputs: [
        {
          id: "dispensingDate",
          label: "Dispensing Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceStartDate",
          label: "Source Start Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceEndDate",
          label: "Source End Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "endInclusive",
          label: "End Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "daysFromStart",
          label: "Days From Start",
          valueType: { type: "integer" },
        },
        {
          id: "daysToEnd",
          label: "Days To End",
          valueType: { type: "integer" },
        },
        {
          id: "sourceCoversDate",
          label: "Source Covers Date",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = dispensingSourcePeriodGapTool.execute;
export default dispensingSourcePeriodGapTool;
