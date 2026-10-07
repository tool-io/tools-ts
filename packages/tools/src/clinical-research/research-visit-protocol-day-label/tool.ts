import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceDate: string;
  readonly visitDate: string;
  readonly referenceIsDayOne: boolean;
};
export type Output = { readonly protocolDay: number; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceDate: { type: "string", maxLength: 8192 },
    visitDate: { type: "string", maxLength: 8192 },
    referenceIsDayOne: { type: "boolean" },
  },
  required: ["referenceDate", "visitDate", "referenceIsDayOne"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    protocolDay: { type: "integer" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["protocolDay", "label"],
} as const;
/** Label an explicit visit-date offset with a caller-selected day-zero or no-day-zero convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceDate, visitDate, referenceIsDayOne } = request;
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
    return (() => {
      const offset =
        (namedDate(visitDate, "visitDate").getTime() -
          namedDate(referenceDate, "referenceDate").getTime()) /
        86400000;
      const protocolDay = offset + (referenceIsDayOne && offset >= 0 ? 1 : 0);
      return { protocolDay, label: "Day " + protocolDay };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceDate: "2026-11-01",
    visitDate: "2026-11-03",
    referenceIsDayOne: true,
  },
  output: { protocolDay: 3, label: "Day 3" },
} satisfies ToolExample<Input, Output>;
export const researchVisitProtocolDayLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "clinical-research",
        "clinical research",
        "research and quality management",
      ],
      keywords: ["clinical research", "research and quality management"],
    },
    id: "clinical-research/research-visit-protocol-day-label",
    title: "Research Visit Protocol Day Label",
    description:
      "Label an explicit visit-date offset with a caller-selected day-zero or no-day-zero convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceDate: { type: "string", maxLength: 8192 },
        visitDate: { type: "string", maxLength: 8192 },
        referenceIsDayOne: { type: "boolean" },
      },
      required: ["referenceDate", "visitDate", "referenceIsDayOne"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        protocolDay: { type: "integer" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["protocolDay", "label"],
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
          id: "visitDate",
          label: "Visit Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceIsDayOne",
          label: "Reference Is Day One",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "protocolDay",
          label: "Protocol Day",
          valueType: { type: "integer" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = researchVisitProtocolDayLabelTool.execute;
export default researchVisitProtocolDayLabelTool;
