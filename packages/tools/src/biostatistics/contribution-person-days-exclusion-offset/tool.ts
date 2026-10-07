import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedPersonDays: number;
  readonly excludedPersonDays: number;
};
export type Output = { readonly includedPersonDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedPersonDays: { type: "number", minimum: 0 },
    excludedPersonDays: { type: "number", minimum: 0 },
  },
  required: ["recordedPersonDays", "excludedPersonDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { includedPersonDays: { type: "number" } },
  required: ["includedPersonDays"],
} as const;
/** Subtract explicitly excluded person-days from recorded study exposure, retaining inconsistent negative totals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedPersonDays, excludedPersonDays } = request;
  const compute = (): Output => {
    H.domain(recordedPersonDays >= 0, "recordedPersonDays");
    H.domain(excludedPersonDays >= 0, "excludedPersonDays");
    return { includedPersonDays: recordedPersonDays - excludedPersonDays };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedPersonDays: 120, excludedPersonDays: 15 },
  output: { includedPersonDays: 105 },
} satisfies ToolExample<Input, Output>;
export const contributionPersonDaysExclusionOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["biostatistics", "research and quality management"],
        keywords: ["biostatistics", "research and quality management"],
      },
      id: "biostatistics/contribution-person-days-exclusion-offset",
      title: "Contribution Person Days Exclusion Offset",
      description:
        "Subtract explicitly excluded person-days from recorded study exposure, retaining inconsistent negative totals.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordedPersonDays: { type: "number", minimum: 0 },
          excludedPersonDays: { type: "number", minimum: 0 },
        },
        required: ["recordedPersonDays", "excludedPersonDays"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { includedPersonDays: { type: "number" } },
        required: ["includedPersonDays"],
      },
      ports: {
        inputs: [
          {
            id: "recordedPersonDays",
            label: "Recorded Person Days",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "excludedPersonDays",
            label: "Excluded Person Days",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "includedPersonDays",
            label: "Included Person Days",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = contributionPersonDaysExclusionOffsetTool.execute;
export default contributionPersonDaysExclusionOffsetTool;
