import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volume: number;
  readonly linearCoefficient: number;
  readonly temperatureChange: number;
};
export type Output = { readonly volumeChange: number; readonly volume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "number", minimum: 0 },
    linearCoefficient: { type: "number" },
    temperatureChange: { type: "number" },
  },
  required: ["volume", "linearCoefficient", "temperatureChange"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volumeChange: { type: "number" }, volume: { type: "number" } },
  required: ["volumeChange", "volume"],
} as const;
/** Apply the isotropic first-order volumetric coefficient approximation 3*linearCoefficient. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volume, linearCoefficient, temperatureChange } = request;
  const compute = (): Output => {
    H.domain(volume >= 0);
    const volumeChange = 3 * volume * linearCoefficient * temperatureChange;
    return { volumeChange, volume: volume + volumeChange };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volume: 2, linearCoefficient: 0.00001, temperatureChange: 100 },
  output: { volumeChange: 0.006000000000000001, volume: 2.006 },
} satisfies ToolExample<Input, Output>;
export const thermalExpansionVolumeFirstOrderTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physics/thermal-expansion-volume-first-order-term",
      title: "Thermal Expansion Volume First Order Term Tool",
      description:
        "Apply the isotropic first-order volumetric coefficient approximation 3*linearCoefficient.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          volume: { type: "number", minimum: 0 },
          linearCoefficient: { type: "number" },
          temperatureChange: { type: "number" },
        },
        required: ["volume", "linearCoefficient", "temperatureChange"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          volumeChange: { type: "number" },
          volume: { type: "number" },
        },
        required: ["volumeChange", "volume"],
      },
      ports: {
        inputs: [
          {
            id: "volume",
            label: "Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "linearCoefficient",
            label: "Linear Coefficient",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "temperatureChange",
            label: "Temperature Change",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "volumeChange",
            label: "Volume Change",
            valueType: { type: "number" },
          },
          { id: "volume", label: "Volume", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = thermalExpansionVolumeFirstOrderTermTool.execute;
export default thermalExpansionVolumeFirstOrderTermTool;
