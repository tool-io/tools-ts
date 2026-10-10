import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reagentId: string;
  readonly fluorophoreLabel: string;
  readonly detectorChannel: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reagentId: { type: "string", maxLength: 8192, minLength: 1 },
    fluorophoreLabel: { type: "string", maxLength: 8192, minLength: 1 },
    detectorChannel: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["reagentId", "fluorophoreLabel", "detectorChannel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate explicitly supplied immune reagent, fluorophore and channel labels without spectral compatibility or panel-design claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reagentId, fluorophoreLabel, detectorChannel } = request;
  const compute = (): Output => {
    H.domain(reagentId.length > 0, "reagentId");
    H.domain(fluorophoreLabel.length > 0, "fluorophoreLabel");
    H.domain(detectorChannel.length > 0, "detectorChannel");
    return {
      token: JSON.stringify([reagentId, fluorophoreLabel, detectorChannel]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reagentId: "R17",
    fluorophoreLabel: "Fluor A",
    detectorChannel: "CH4",
  },
  output: { token: '["R17","Fluor A","CH4"]' },
} satisfies ToolExample<Input, Output>;
export const immuneReagentFluorophoreChannelPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "immunology/immune-reagent-fluorophore-channel-pair",
      title: "Immune Reagent Fluorophore Channel Pair Tool",
      description:
        "Associate explicitly supplied immune reagent, fluorophore and channel labels without spectral compatibility or panel-design claims.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reagentId: { type: "string", maxLength: 8192, minLength: 1 },
          fluorophoreLabel: { type: "string", maxLength: 8192, minLength: 1 },
          detectorChannel: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["reagentId", "fluorophoreLabel", "detectorChannel"],
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
            id: "reagentId",
            label: "Reagent Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "fluorophoreLabel",
            label: "Fluorophore Label",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "detectorChannel",
            label: "Detector Channel",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = immuneReagentFluorophoreChannelPairTool.execute;
export default immuneReagentFluorophoreChannelPairTool;
