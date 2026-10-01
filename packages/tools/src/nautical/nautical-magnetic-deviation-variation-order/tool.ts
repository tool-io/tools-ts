import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly compass: number;
  readonly deviationEast: number;
  readonly variationEast: number;
};
export type Output = {
  readonly magnetic: number;
  readonly trueBearing: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    compass: { type: "number" },
    deviationEast: { type: "number" },
    variationEast: { type: "number" },
  },
  required: ["compass", "deviationEast", "variationEast"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { magnetic: { type: "number" }, trueBearing: { type: "number" } },
  required: ["magnetic", "trueBearing"],
} as const;
/** Calculate nautical magnetic deviation variation order from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { compass, deviationEast, variationEast } = request;
  const compute = (): Output => {
    const magnetic = H.mod(compass + deviationEast, 360);
    return { magnetic, trueBearing: H.mod(magnetic + variationEast, 360) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { compass: 350, deviationEast: 5, variationEast: 10 },
  output: { magnetic: 355, trueBearing: 5 },
} satisfies ToolExample<Input, Output>;
export const nauticalMagneticDeviationVariationOrderTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "nautical/nautical-magnetic-deviation-variation-order",
      title: "Nautical Magnetic Deviation Variation Order Tool",
      description:
        "Calculate nautical magnetic deviation variation order from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          compass: { type: "number" },
          deviationEast: { type: "number" },
          variationEast: { type: "number" },
        },
        required: ["compass", "deviationEast", "variationEast"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          magnetic: { type: "number" },
          trueBearing: { type: "number" },
        },
        required: ["magnetic", "trueBearing"],
      },
      ports: {
        inputs: [
          {
            id: "compass",
            label: "Compass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deviationEast",
            label: "Deviation East",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "variationEast",
            label: "Variation East",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "magnetic", label: "Magnetic", valueType: { type: "number" } },
          {
            id: "trueBearing",
            label: "True Bearing",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = nauticalMagneticDeviationVariationOrderTool.execute;
export default nauticalMagneticDeviationVariationOrderTool;
