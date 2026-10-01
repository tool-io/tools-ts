import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bridgeElevation: number;
  readonly waterElevation: number;
  readonly airDraft: number;
};
export type Output = {
  readonly availableClearance: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bridgeElevation: { type: "number" },
    waterElevation: { type: "number" },
    airDraft: { type: "number", minimum: 0 },
  },
  required: ["bridgeElevation", "waterElevation", "airDraft"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableClearance: { type: "number" },
    margin: { type: "number" },
  },
  required: ["availableClearance", "margin"],
} as const;
/** Calculate vessel airdraft bridge datum gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bridgeElevation, waterElevation, airDraft } = request;
  const compute = (): Output => {
    H.domain(airDraft >= 0);
    const availableClearance = bridgeElevation - waterElevation;
    return { availableClearance, margin: availableClearance - airDraft };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bridgeElevation: 20, waterElevation: 3, airDraft: 15 },
  output: { availableClearance: 17, margin: 2 },
} satisfies ToolExample<Input, Output>;
export const vesselAirdraftBridgeDatumGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/vessel-airdraft-bridge-datum-gap",
    title: "Vessel Airdraft Bridge Datum Gap Tool",
    description:
      "Calculate vessel airdraft bridge datum gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bridgeElevation: { type: "number" },
        waterElevation: { type: "number" },
        airDraft: { type: "number", minimum: 0 },
      },
      required: ["bridgeElevation", "waterElevation", "airDraft"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableClearance: { type: "number" },
        margin: { type: "number" },
      },
      required: ["availableClearance", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "bridgeElevation",
          label: "Bridge Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterElevation",
          label: "Water Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "airDraft",
          label: "Air Draft",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableClearance",
          label: "Available Clearance",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = vesselAirdraftBridgeDatumGapTool.execute;
export default vesselAirdraftBridgeDatumGapTool;
