import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialVolume: number;
  readonly topupVolume: number;
};
export type Output = {
  readonly finalVolume: number;
  readonly topupFractionOfFinal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialVolume: { type: "number", minimum: 0 },
    topupVolume: { type: "number", minimum: 0 },
  },
  required: ["initialVolume", "topupVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finalVolume: { type: "number" },
    topupFractionOfFinal: { type: "number" },
  },
  required: ["finalVolume", "topupFractionOfFinal"],
} as const;
/** Calculate top-up share of explicit additive final reservoir volume without estimating nutrient concentration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialVolume, topupVolume } = request;
  const compute = (): Output => {
    H.domain(initialVolume >= 0 && topupVolume >= 0, "initialVolume");
    (H.domain(initialVolume + topupVolume > 0, "initialVolume"),
      initialVolume + topupVolume);
    return {
      finalVolume: initialVolume + topupVolume,
      topupFractionOfFinal: topupVolume / (initialVolume + topupVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialVolume: 80, topupVolume: 20 },
  output: { finalVolume: 100, topupFractionOfFinal: 0.2 },
} satisfies ToolExample<Input, Output>;
export const reservoirTopupVolumeFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["hydroponics", "agriculture"],
      keywords: ["hydroponics", "agriculture"],
    },
    id: "hydroponics/reservoir-topup-volume-fraction",
    title: "Reservoir Topup Volume Fraction",
    description:
      "Calculate top-up share of explicit additive final reservoir volume without estimating nutrient concentration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialVolume: { type: "number", minimum: 0 },
        topupVolume: { type: "number", minimum: 0 },
      },
      required: ["initialVolume", "topupVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        finalVolume: { type: "number" },
        topupFractionOfFinal: { type: "number" },
      },
      required: ["finalVolume", "topupFractionOfFinal"],
    },
    ports: {
      inputs: [
        {
          id: "initialVolume",
          label: "Initial Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "topupVolume",
          label: "Topup Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "finalVolume",
          label: "Final Volume",
          valueType: { type: "number" },
        },
        {
          id: "topupFractionOfFinal",
          label: "Topup Fraction Of Final",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reservoirTopupVolumeFractionTool.execute;
export default reservoirTopupVolumeFractionTool;
