import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly charterId: string;
  readonly recordedSeals: number;
  readonly missingSealPositions: number;
};
export type Output = {
  readonly label: string;
  readonly totalRecordedPositions: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    charterId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedSeals: { type: "integer", minimum: 0 },
    missingSealPositions: { type: "integer", minimum: 0 },
  },
  required: ["charterId", "recordedSeals", "missingSealPositions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    totalRecordedPositions: { type: "integer" },
  },
  required: ["label", "totalRecordedPositions"],
} as const;
/** Label explicit surviving seal and missing-position counts without inferring authenticity or original seal totals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { charterId, recordedSeals, missingSealPositions } = request;
  const compute = (): Output => {
    H.domain(charterId.length > 0, "charterId");
    (H.domain(
      Number.isSafeInteger(recordedSeals) &&
        recordedSeals >= 0 &&
        recordedSeals <= Number.MAX_SAFE_INTEGER,
      "recordedSeals",
    ),
      recordedSeals);
    (H.domain(
      Number.isSafeInteger(missingSealPositions) &&
        missingSealPositions >= 0 &&
        missingSealPositions <= Number.MAX_SAFE_INTEGER,
      "missingSealPositions",
    ),
      missingSealPositions);
    return {
      label:
        charterId +
        "; seals=" +
        recordedSeals +
        "; missing positions=" +
        missingSealPositions,
      totalRecordedPositions: Number(
        BigInt(recordedSeals) + BigInt(missingSealPositions),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { charterId: "CH17", recordedSeals: 3, missingSealPositions: 1 },
  output: {
    label: "CH17; seals=3; missing positions=1",
    totalRecordedPositions: 4,
  },
} satisfies ToolExample<Input, Output>;
export const europeanCharterSealCountLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["european-studies", "european studies", "humanities"],
      keywords: ["european studies", "humanities"],
    },
    id: "european-studies/european-charter-seal-count-label",
    title: "European Charter Seal Count Label",
    description:
      "Label explicit surviving seal and missing-position counts without inferring authenticity or original seal totals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        charterId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedSeals: { type: "integer", minimum: 0 },
        missingSealPositions: { type: "integer", minimum: 0 },
      },
      required: ["charterId", "recordedSeals", "missingSealPositions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        totalRecordedPositions: { type: "integer" },
      },
      required: ["label", "totalRecordedPositions"],
    },
    ports: {
      inputs: [
        {
          id: "charterId",
          label: "Charter Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedSeals",
          label: "Recorded Seals",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "missingSealPositions",
          label: "Missing Seal Positions",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "totalRecordedPositions",
          label: "Total Recorded Positions",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = europeanCharterSealCountLabelTool.execute;
export default europeanCharterSealCountLabelTool;
