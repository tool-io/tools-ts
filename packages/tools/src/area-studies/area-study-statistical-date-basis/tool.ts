import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly datasetId: string;
  readonly periodText: string;
  readonly dateBasis: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    datasetId: { type: "string", maxLength: 8192, minLength: 1 },
    periodText: { type: "string", maxLength: 8192, minLength: 1 },
    dateBasis: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["datasetId", "periodText", "dateBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit statistical period and date basis without aligning series. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { datasetId, periodText, dateBasis } = request;
  const compute = (): Output => {
    H.domain(datasetId.length > 0, "datasetId");
    H.domain(periodText.length > 0, "periodText");
    H.domain(dateBasis.length > 0, "dateBasis");
    return { token: JSON.stringify([datasetId, periodText, dateBasis]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { datasetId: "D17", periodText: "2025", dateBasis: "calendar year" },
  output: { token: '["D17","2025","calendar year"]' },
} satisfies ToolExample<Input, Output>;
export const areaStudyStatisticalDatebasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["area-studies", "area studies", "humanities"],
      keywords: ["area studies", "humanities"],
    },
    id: "area-studies/area-study-statistical-date-basis",
    title: "Area Study Statistical Date Basis",
    description:
      "Record an explicit statistical period and date basis without aligning series.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        datasetId: { type: "string", maxLength: 8192, minLength: 1 },
        periodText: { type: "string", maxLength: 8192, minLength: 1 },
        dateBasis: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["datasetId", "periodText", "dateBasis"],
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
          id: "datasetId",
          label: "Dataset Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "periodText",
          label: "Period Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dateBasis",
          label: "Date Basis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = areaStudyStatisticalDatebasisTool.execute;
export default areaStudyStatisticalDatebasisTool;
