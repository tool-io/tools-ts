import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly groundSpeed: number;
  readonly waterSpeed: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groundSpeed: { type: "number", minimum: 0 },
    waterSpeed: { type: "number", minimum: 0 },
  },
  required: ["groundSpeed", "waterSpeed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Subtract scalar speeds without treating the difference as a complete current vector. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { groundSpeed, waterSpeed } = request;
  const compute = (): Output => {
    H.domain(groundSpeed >= 0 && waterSpeed >= 0);
    return { gap: groundSpeed - waterSpeed };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { groundSpeed: 12, waterSpeed: 10 },
  output: { gap: 2 },
} satisfies ToolExample<Input, Output>;
export const nauticalSpeedOverWaterGroundGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/nautical-speed-over-water-ground-gap",
    title: "Nautical Speed Over Water Ground Gap Tool",
    description:
      "Subtract scalar speeds without treating the difference as a complete current vector.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groundSpeed: { type: "number", minimum: 0 },
        waterSpeed: { type: "number", minimum: 0 },
      },
      required: ["groundSpeed", "waterSpeed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "groundSpeed",
          label: "Ground Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterSpeed",
          label: "Water Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = nauticalSpeedOverWaterGroundGapTool.execute;
export default nauticalSpeedOverWaterGroundGapTool;
