import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenCode: string;
  readonly fastingStatus: string;
  readonly reportedHours: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenCode: { type: "string", maxLength: 8192, minLength: 1 },
    fastingStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["reported-fasting", "reported-nonfasting", "unknown"],
    },
    reportedHours: { type: "number", minimum: 0 },
  },
  required: ["specimenCode", "fastingStatus", "reportedHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicitly reported specimen fasting metadata without determining preparation adequacy or recommending fasting. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenCode, fastingStatus, reportedHours } = request;
  const compute = (): Output => {
    H.domain(specimenCode.length > 0 && reportedHours >= 0, "specimenCode");
    H.domain(
      ["reported-fasting", "reported-nonfasting", "unknown"].includes(
        fastingStatus,
      ),
      "fastingStatus",
    );
    return {
      label:
        specimenCode +
        " [" +
        fastingStatus +
        "; reported " +
        reportedHours +
        " h]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenCode: "S17",
    fastingStatus: "reported-fasting",
    reportedHours: 8,
  },
  output: { label: "S17 [reported-fasting; reported 8 h]" },
} satisfies ToolExample<Input, Output>;
export const endocrineSpecimenFastingStatusLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["endocrinology", "health and medicine"],
        keywords: ["endocrinology", "health and medicine"],
      },
      id: "endocrinology/endocrine-specimen-fasting-status-label",
      title: "Endocrine Specimen Fasting Status Label",
      description:
        "Label explicitly reported specimen fasting metadata without determining preparation adequacy or recommending fasting.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          specimenCode: { type: "string", maxLength: 8192, minLength: 1 },
          fastingStatus: {
            type: "string",
            maxLength: 8192,
            enum: ["reported-fasting", "reported-nonfasting", "unknown"],
          },
          reportedHours: { type: "number", minimum: 0 },
        },
        required: ["specimenCode", "fastingStatus", "reportedHours"],
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
            id: "specimenCode",
            label: "Specimen Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "fastingStatus",
            label: "Fasting Status",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "reportedHours",
            label: "Reported Hours",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = endocrineSpecimenFastingStatusLabelTool.execute;
export default endocrineSpecimenFastingStatusLabelTool;
