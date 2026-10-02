import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nearInfrared: number;
  readonly red: number;
  readonly suppliedAdjustment: number;
};
export type Output = { readonly savi: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nearInfrared: { type: "number" },
    red: { type: "number" },
    suppliedAdjustment: { type: "number", minimum: 0 },
  },
  required: ["nearInfrared", "red", "suppliedAdjustment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { savi: { type: "number" } },
  required: ["savi"],
} as const;
/** Calculate vegetation index soil adjustment supplied factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nearInfrared, red, suppliedAdjustment } = request;
  const compute = (): Output => {
    H.domain(
      suppliedAdjustment >= 0 && nearInfrared + red + suppliedAdjustment !== 0,
    );
    return {
      savi:
        ((1 + suppliedAdjustment) * (nearInfrared - red)) /
        (nearInfrared + red + suppliedAdjustment),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nearInfrared: 0.6, red: 0.2, suppliedAdjustment: 0.5 },
  output: { savi: 0.4615384615384615 },
} satisfies ToolExample<Input, Output>;
export const vegetationIndexSoilAdjustmentSuppliedFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "precision-agriculture/vegetation-index-soil-adjustment-supplied-factor",
      title: "Vegetation Index Soil Adjustment Supplied Factor Tool",
      description:
        "Calculate vegetation index soil adjustment supplied factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nearInfrared: { type: "number" },
          red: { type: "number" },
          suppliedAdjustment: { type: "number", minimum: 0 },
        },
        required: ["nearInfrared", "red", "suppliedAdjustment"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { savi: { type: "number" } },
        required: ["savi"],
      },
      ports: {
        inputs: [
          {
            id: "nearInfrared",
            label: "Near Infrared",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "red",
            label: "Red",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedAdjustment",
            label: "Supplied Adjustment",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [{ id: "savi", label: "Savi", valueType: { type: "number" } }],
      },
    },
    calculate,
  });
export const run = vegetationIndexSoilAdjustmentSuppliedFactorTool.execute;
export default vegetationIndexSoilAdjustmentSuppliedFactorTool;
