import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recoveredCondensateVolume: number;
  readonly totalCondensateVolume: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recoveredCondensateVolume: { type: "number", minimum: 0 },
    totalCondensateVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["recoveredCondensateVolume", "totalCondensateVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize an explicitly recovered condensate volume to compatible total condensate volume. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recoveredCondensateVolume, totalCondensateVolume } = request;
  const compute = (): Output => {
    (H.domain(totalCondensateVolume > 0, "totalCondensateVolume"),
      totalCondensateVolume);
    H.domain(
      recoveredCondensateVolume >= 0 &&
        recoveredCondensateVolume <= totalCondensateVolume,
      "recoveredCondensateVolume",
    );
    return {
      fraction: recoveredCondensateVolume / totalCondensateVolume,
      remainder: totalCondensateVolume - recoveredCondensateVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recoveredCondensateVolume: 30, totalCondensateVolume: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const growRoomCondensateWaterRecoveryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["vertical-farming", "vertical farming", "agriculture"],
      keywords: ["vertical farming", "agriculture"],
    },
    id: "vertical-farming/grow-room-condensate-water-recovery",
    title: "Grow Room Condensate Water Recovery",
    description:
      "Normalize an explicitly recovered condensate volume to compatible total condensate volume.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recoveredCondensateVolume: { type: "number", minimum: 0 },
        totalCondensateVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["recoveredCondensateVolume", "totalCondensateVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "recoveredCondensateVolume",
          label: "Recovered Condensate Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalCondensateVolume",
          label: "Total Condensate Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = growRoomCondensateWaterRecoveryTool.execute;
export default growRoomCondensateWaterRecoveryTool;
