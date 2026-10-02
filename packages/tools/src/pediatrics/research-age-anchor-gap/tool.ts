import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly birthDate: string;
  readonly eventDate: string;
  readonly suppliedAnchorDays: number;
};
export type Output = {
  readonly ageDays: number;
  readonly anchorGapDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    birthDate: { type: "string", maxLength: 8192 },
    eventDate: { type: "string", maxLength: 8192 },
    suppliedAnchorDays: { type: "integer", minimum: 0 },
  },
  required: ["birthDate", "eventDate", "suppliedAnchorDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageDays: { type: "integer" },
    anchorGapDays: { type: "integer" },
  },
  required: ["ageDays", "anchorGapDays"],
} as const;
/** Compare supplied civil-date research age with an explicit day anchor; no age-category or care rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { birthDate, eventDate, suppliedAnchorDays } = request;
  const compute = (): Output => {
    H.integer(suppliedAnchorDays, 0);
    return (() => {
      const ageDays =
        (H.dateOnly(eventDate).getTime() - H.dateOnly(birthDate).getTime()) /
        86400000;
      return { ageDays, anchorGapDays: ageDays - suppliedAnchorDays };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    birthDate: "2024-02-28",
    eventDate: "2024-03-01",
    suppliedAnchorDays: 1,
  },
  output: { ageDays: 2, anchorGapDays: 1 },
} satisfies ToolExample<Input, Output>;
export const researchAgeAnchorGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pediatrics/research-age-anchor-gap",
    title: "Research Age Anchor Gap Tool",
    description:
      "Compare supplied civil-date research age with an explicit day anchor; no age-category or care rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        birthDate: { type: "string", maxLength: 8192 },
        eventDate: { type: "string", maxLength: 8192 },
        suppliedAnchorDays: { type: "integer", minimum: 0 },
      },
      required: ["birthDate", "eventDate", "suppliedAnchorDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageDays: { type: "integer" },
        anchorGapDays: { type: "integer" },
      },
      required: ["ageDays", "anchorGapDays"],
    },
    ports: {
      inputs: [
        {
          id: "birthDate",
          label: "Birth Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "eventDate",
          label: "Event Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedAnchorDays",
          label: "Supplied Anchor Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "ageDays", label: "Age Days", valueType: { type: "integer" } },
        {
          id: "anchorGapDays",
          label: "Anchor Gap Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchAgeAnchorGapTool.execute;
export default researchAgeAnchorGapTool;
