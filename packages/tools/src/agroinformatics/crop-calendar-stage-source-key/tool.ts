import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cropCode: string;
  readonly stageCode: string;
  readonly source: string;
  readonly edition: string;
};
export type Output = { readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cropCode: { type: "string", maxLength: 8192 },
    stageCode: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
  },
  required: ["cropCode", "stageCode", "source", "edition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
/** Preserve supplied crop-stage source/edition context without selecting phenology dates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cropCode, stageCode, source, edition } = request;
  const compute = (): Output => {
    H.domain([cropCode, stageCode, source, edition].every((x) => x.length > 0));
    return { key: JSON.stringify([source, edition, cropCode, stageCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cropCode: "C1",
    stageCode: "02",
    source: "calendar-A",
    edition: "v1",
  },
  output: { key: '["calendar-A","v1","C1","02"]' },
} satisfies ToolExample<Input, Output>;
export const cropCalendarStageSourceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroinformatics/crop-calendar-stage-source-key",
    title: "Crop Calendar Stage Source Key Tool",
    description:
      "Preserve supplied crop-stage source/edition context without selecting phenology dates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cropCode: { type: "string", maxLength: 8192 },
        stageCode: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        edition: { type: "string", maxLength: 8192 },
      },
      required: ["cropCode", "stageCode", "source", "edition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { key: { type: "string", maxLength: 8192 } },
      required: ["key"],
    },
    ports: {
      inputs: [
        {
          id: "cropCode",
          label: "Crop Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "stageCode",
          label: "Stage Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "key", label: "Key", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = cropCalendarStageSourceKeyTool.execute;
export default cropCalendarStageSourceKeyTool;
