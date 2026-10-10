import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly suppliedGestationalDays: number;
  readonly datingSource: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedGestationalDays: { type: "integer", minimum: 0 },
    datingSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "suppliedGestationalDays", "datingSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach an explicitly supplied gestational day and source to a specimen without dating pregnancy or interpreting a sample. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, suppliedGestationalDays, datingSource } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0 && datingSource.length > 0, "specimenId");
    (H.domain(
      Number.isSafeInteger(suppliedGestationalDays) &&
        suppliedGestationalDays >= 0 &&
        suppliedGestationalDays <= Number.MAX_SAFE_INTEGER,
      "suppliedGestationalDays",
    ),
      suppliedGestationalDays);
    return {
      label:
        specimenId +
        "; gestational day=" +
        suppliedGestationalDays +
        " [" +
        datingSource +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenId: "S17",
    suppliedGestationalDays: 198,
    datingSource: "Recorded estimate A",
  },
  output: { label: "S17; gestational day=198 [Recorded estimate A]" },
} satisfies ToolExample<Input, Output>;
export const obstetricSampleGestationalDayTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["obstetrics", "health and medicine"],
      keywords: ["obstetrics", "health and medicine"],
    },
    id: "obstetrics/obstetric-sample-gestational-day-tag",
    title: "Obstetric Sample Gestational Day Tag",
    description:
      "Attach an explicitly supplied gestational day and source to a specimen without dating pregnancy or interpreting a sample.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedGestationalDays: { type: "integer", minimum: 0 },
        datingSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "suppliedGestationalDays", "datingSource"],
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
          id: "suppliedGestationalDays",
          label: "Supplied Gestational Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "datingSource",
          label: "Dating Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = obstetricSampleGestationalDayTagTool.execute;
export default obstetricSampleGestationalDayTagTool;
