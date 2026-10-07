import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly determinationDate: string;
  readonly determinerWording: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    determinationDate: { type: "string", maxLength: 8192 },
    determinerWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "determinationDate", "determinerWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach an explicit calendar determination date and attribution to a herbarium record without verifying an identification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, determinationDate, determinerWording } = request;
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
    H.domain(
      specimenId.length > 0 && determinerWording.length > 0,
      "specimenId",
    );
    namedDate(determinationDate, "determinationDate");
    return {
      label:
        specimenId +
        "; determined=" +
        determinationDate +
        " [" +
        determinerWording +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenId: "H17",
    determinationDate: "2026-03-15",
    determinerWording: "Determiner A",
  },
  output: { label: "H17; determined=2026-03-15 [Determiner A]" },
} satisfies ToolExample<Input, Output>;
export const herbariumDeterminationDateLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["botany", "biology"],
      keywords: ["botany", "biology"],
    },
    id: "botany/herbarium-determination-date-label",
    title: "Herbarium Determination Date Label",
    description:
      "Attach an explicit calendar determination date and attribution to a herbarium record without verifying an identification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        determinationDate: { type: "string", maxLength: 8192 },
        determinerWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "determinationDate", "determinerWording"],
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
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "determinationDate",
          label: "Determination Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "determinerWording",
          label: "Determiner Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = herbariumDeterminationDateLabelTool.execute;
export default herbariumDeterminationDateLabelTool;
