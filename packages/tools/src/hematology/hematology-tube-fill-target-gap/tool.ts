import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedTargetVolume: number;
  readonly recordedFillVolume: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedTargetVolume: { type: "number" },
    recordedFillVolume: { type: "number" },
  },
  required: ["suppliedTargetVolume", "recordedFillVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate signed supplied hematology tube fill-minus-target volume without choosing tolerances or declaring specimen acceptability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedTargetVolume, recordedFillVolume } = request;
  const compute = (): Output => {
    return { signedGap: recordedFillVolume - suppliedTargetVolume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedTargetVolume: 12, recordedFillVolume: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const hematologyTubeFillTargetGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/hematology-tube-fill-target-gap",
    title: "Hematology Tube Fill Target Gap Tool",
    description:
      "Calculate signed supplied hematology tube fill-minus-target volume without choosing tolerances or declaring specimen acceptability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedTargetVolume: { type: "number" },
        recordedFillVolume: { type: "number" },
      },
      required: ["suppliedTargetVolume", "recordedFillVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedTargetVolume",
          label: "Supplied Target Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedFillVolume",
          label: "Recorded Fill Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hematologyTubeFillTargetGapTool.execute;
export default hematologyTubeFillTargetGapTool;
