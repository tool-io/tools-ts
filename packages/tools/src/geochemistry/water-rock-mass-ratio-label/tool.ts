import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly suppliedRatioText: string;
  readonly massBasis: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedRatioText: { type: "string", maxLength: 8192, minLength: 1 },
    massBasis: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "suppliedRatioText", "massBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit water-rock mass ratio transcription and basis without equating mass and volume ratios. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, suppliedRatioText, massBasis } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(suppliedRatioText.length > 0, "suppliedRatioText");
    H.domain(massBasis.length > 0, "massBasis");
    return { token: JSON.stringify([sampleId, suppliedRatioText, massBasis]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleId: "S17",
    suppliedRatioText: "2:1",
    massBasis: "water/rock dry mass",
  },
  output: { token: '["S17","2:1","water/rock dry mass"]' },
} satisfies ToolExample<Input, Output>;
export const waterRockMassRatioLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/water-rock-mass-ratio-label",
    title: "Water Rock Mass Ratio Label Tool",
    description:
      "Preserve an explicit water-rock mass ratio transcription and basis without equating mass and volume ratios.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedRatioText: { type: "string", maxLength: 8192, minLength: 1 },
        massBasis: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sampleId", "suppliedRatioText", "massBasis"],
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
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedRatioText",
          label: "Supplied Ratio Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "massBasis",
          label: "Mass Basis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = waterRockMassRatioLabelTool.execute;
export default waterRockMassRatioLabelTool;
