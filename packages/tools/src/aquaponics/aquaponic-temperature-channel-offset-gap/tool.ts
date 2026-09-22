import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fishReading: number;
  readonly plantReading: number;
  readonly fishOffset: number;
  readonly plantOffset: number;
};
export type Output = { readonly correctedGap: number; readonly rawGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fishReading: { type: "number" },
    plantReading: { type: "number" },
    fishOffset: { type: "number" },
    plantOffset: { type: "number" },
  },
  required: ["fishReading", "plantReading", "fishOffset", "plantOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedGap: { type: "number" }, rawGap: { type: "number" } },
  required: ["correctedGap", "rawGap"],
} as const;
/** Compare supplied sensor readings after explicit calibration offsets. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fishReading, plantReading, fishOffset, plantOffset } = request;
  const compute = (): Output => {
    return {
      correctedGap: fishReading - fishOffset - plantReading + plantOffset,
      rawGap: fishReading - plantReading,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fishReading: 25, plantReading: 23, fishOffset: 1, plantOffset: 0.5 },
  output: { correctedGap: 1.5, rawGap: 2 },
} satisfies ToolExample<Input, Output>;
export const aquaponicTemperatureChannelOffsetGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "aquaponics/aquaponic-temperature-channel-offset-gap",
      title: "Aquaponic Temperature Channel Offset Gap Tool",
      description:
        "Compare supplied sensor readings after explicit calibration offsets.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fishReading: { type: "number" },
          plantReading: { type: "number" },
          fishOffset: { type: "number" },
          plantOffset: { type: "number" },
        },
        required: ["fishReading", "plantReading", "fishOffset", "plantOffset"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          correctedGap: { type: "number" },
          rawGap: { type: "number" },
        },
        required: ["correctedGap", "rawGap"],
      },
      ports: {
        inputs: [
          {
            id: "fishReading",
            label: "Fish Reading",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "plantReading",
            label: "Plant Reading",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fishOffset",
            label: "Fish Offset",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "plantOffset",
            label: "Plant Offset",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "correctedGap",
            label: "Corrected Gap",
            valueType: { type: "number" },
          },
          { id: "rawGap", label: "Raw Gap", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = aquaponicTemperatureChannelOffsetGapTool.execute;
export default aquaponicTemperatureChannelOffsetGapTool;
