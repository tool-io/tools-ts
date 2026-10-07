import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flowMillilitersPerMinute: number;
  readonly delaySeconds: number;
};
export type Output = { readonly delayVolumeMilliliters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flowMillilitersPerMinute: { type: "number", minimum: 0 },
    delaySeconds: { type: "number", minimum: 0 },
  },
  required: ["flowMillilitersPerMinute", "delaySeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delayVolumeMilliliters: { type: "number" } },
  required: ["delayVolumeMilliliters"],
} as const;
/** Convert a recorded detector-to-collector delay and constant flow rate into delay volume without selecting collection conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flowMillilitersPerMinute, delaySeconds } = request;
  const compute = (): Output => {
    H.domain(
      flowMillilitersPerMinute >= 0 && delaySeconds >= 0,
      "flowMillilitersPerMinute",
    );
    return {
      delayVolumeMilliliters: (flowMillilitersPerMinute * delaySeconds) / 60,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flowMillilitersPerMinute: 1.2, delaySeconds: 30 },
  output: { delayVolumeMilliliters: 0.6 },
} satisfies ToolExample<Input, Output>;
export const chromatogramFractionCollectionDelayVolumeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["biochemistry", "biology"],
        keywords: ["biochemistry", "biology"],
      },
      id: "biochemistry/chromatogram-fraction-collection-delay-volume",
      title: "Chromatogram Fraction Collection Delay Volume",
      description:
        "Convert a recorded detector-to-collector delay and constant flow rate into delay volume without selecting collection conditions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          flowMillilitersPerMinute: { type: "number", minimum: 0 },
          delaySeconds: { type: "number", minimum: 0 },
        },
        required: ["flowMillilitersPerMinute", "delaySeconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { delayVolumeMilliliters: { type: "number" } },
        required: ["delayVolumeMilliliters"],
      },
      ports: {
        inputs: [
          {
            id: "flowMillilitersPerMinute",
            label: "Flow Milliliters Per Minute",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "delaySeconds",
            label: "Delay Seconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "delayVolumeMilliliters",
            label: "Delay Volume Milliliters",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = chromatogramFractionCollectionDelayVolumeTool.execute;
export default chromatogramFractionCollectionDelayVolumeTool;
