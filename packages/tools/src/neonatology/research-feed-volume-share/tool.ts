import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedVolume: number;
  readonly totalRecordedVolume: number;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedVolume: { type: "number", minimum: 0 },
    totalRecordedVolume: { type: "number", minimum: 0 },
  },
  required: ["recordedVolume", "totalRecordedVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Audit one explicit research-record volume share; no feeding recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedVolume, totalRecordedVolume } = request;
  const compute = (): Output => {
    H.domain(
      totalRecordedVolume >= 0 &&
        recordedVolume >= 0 &&
        recordedVolume <= totalRecordedVolume,
    );
    return {
      share: totalRecordedVolume > 0 ? recordedVolume / totalRecordedVolume : 0,
      defined: totalRecordedVolume > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedVolume: 20, totalRecordedVolume: 100 },
  output: { share: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const researchFeedVolumeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neonatology/research-feed-volume-share",
    title: "Research Feed Volume Share Tool",
    description:
      "Audit one explicit research-record volume share; no feeding recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedVolume: { type: "number", minimum: 0 },
        totalRecordedVolume: { type: "number", minimum: 0 },
      },
      required: ["recordedVolume", "totalRecordedVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "recordedVolume",
          label: "Recorded Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalRecordedVolume",
          label: "Total Recorded Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = researchFeedVolumeShareTool.execute;
export default researchFeedVolumeShareTool;
