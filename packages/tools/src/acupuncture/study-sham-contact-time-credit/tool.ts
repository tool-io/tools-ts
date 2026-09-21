import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalContact: number;
  readonly shamSpecific: number;
  readonly sharedContact: number;
  readonly creditShared: boolean;
};
export type Output = {
  readonly creditedSham: number;
  readonly nonSham: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalContact: { type: "number", minimum: 0 },
    shamSpecific: { type: "number", minimum: 0 },
    sharedContact: { type: "number", minimum: 0 },
    creditShared: { type: "boolean" },
  },
  required: ["totalContact", "shamSpecific", "sharedContact", "creditShared"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { creditedSham: { type: "number" }, nonSham: { type: "number" } },
  required: ["creditedSham", "nonSham"],
} as const;
/** Research contact-time allocation under caller-supplied classifications, without assuming sham inertness or efficacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalContact, shamSpecific, sharedContact, creditShared } = request;
  const compute = (): Output => {
    H.domain(
      totalContact >= 0 &&
        shamSpecific >= 0 &&
        sharedContact >= 0 &&
        shamSpecific + sharedContact <= totalContact,
    );
    return {
      creditedSham: shamSpecific + (creditShared ? sharedContact : 0),
      nonSham: totalContact - shamSpecific - (creditShared ? sharedContact : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalContact: 60,
    shamSpecific: 20,
    sharedContact: 10,
    creditShared: true,
  },
  output: { creditedSham: 30, nonSham: 30 },
} satisfies ToolExample<Input, Output>;
export const studyShamContactTimeCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "acupuncture/study-sham-contact-time-credit",
    title: "Study Sham Contact Time Credit Tool",
    description:
      "Research contact-time allocation under caller-supplied classifications, without assuming sham inertness or efficacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalContact: { type: "number", minimum: 0 },
        shamSpecific: { type: "number", minimum: 0 },
        sharedContact: { type: "number", minimum: 0 },
        creditShared: { type: "boolean" },
      },
      required: [
        "totalContact",
        "shamSpecific",
        "sharedContact",
        "creditShared",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        creditedSham: { type: "number" },
        nonSham: { type: "number" },
      },
      required: ["creditedSham", "nonSham"],
    },
    ports: {
      inputs: [
        {
          id: "totalContact",
          label: "Total Contact",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shamSpecific",
          label: "Sham Specific",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedContact",
          label: "Shared Contact",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditShared",
          label: "Credit Shared",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "creditedSham",
          label: "Credited Sham",
          valueType: { type: "number" },
        },
        { id: "nonSham", label: "Non Sham", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = studyShamContactTimeCreditTool.execute;
export default studyShamContactTimeCreditTool;
