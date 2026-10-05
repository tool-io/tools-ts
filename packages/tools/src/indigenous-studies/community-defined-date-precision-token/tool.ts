import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dateText: string;
  readonly communityPrecisionLabel: string;
  readonly sourceId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dateText: { type: "string", maxLength: 8192 },
    communityPrecisionLabel: { type: "string", maxLength: 8192 },
    sourceId: { type: "string", maxLength: 8192 },
  },
  required: ["dateText", "communityPrecisionLabel", "sourceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Attach explicit community-defined precision wording and provenance to a date transcription without imposing calendar fields. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dateText, communityPrecisionLabel, sourceId } = request;
  const compute = (): Output => {
    H.domain(
      dateText.length > 0 &&
        communityPrecisionLabel.length > 0 &&
        sourceId.length > 0,
      "dateText",
    );
    return {
      token: dateText + " [" + communityPrecisionLabel + "; " + sourceId + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dateText: "season A",
    communityPrecisionLabel: "season precision",
    sourceId: "S17",
  },
  output: { token: "season A [season precision; S17]" },
} satisfies ToolExample<Input, Output>;
export const communityDefinedDatePrecisionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "indigenous-studies/community-defined-date-precision-token",
    title: "Community Defined Date Precision Token Tool",
    description:
      "Attach explicit community-defined precision wording and provenance to a date transcription without imposing calendar fields.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dateText: { type: "string", maxLength: 8192 },
        communityPrecisionLabel: { type: "string", maxLength: 8192 },
        sourceId: { type: "string", maxLength: 8192 },
      },
      required: ["dateText", "communityPrecisionLabel", "sourceId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "dateText",
          label: "Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "communityPrecisionLabel",
          label: "Community Precision Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = communityDefinedDatePrecisionTokenTool.execute;
export default communityDefinedDatePrecisionTokenTool;
