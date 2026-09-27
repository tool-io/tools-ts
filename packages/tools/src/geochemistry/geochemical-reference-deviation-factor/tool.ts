import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly measured: number; readonly reference: number };
export type Output = {
  readonly ratio: number;
  readonly fractionalDeviation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { measured: { type: "number" }, reference: { type: "number" } },
  required: ["measured", "reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratio: { type: "number" },
    fractionalDeviation: { type: "number" },
  },
  required: ["ratio", "fractionalDeviation"],
} as const;
/** Calculate geochemical reference deviation factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measured, reference } = request;
  const compute = (): Output => {
    H.domain(reference !== 0);
    return {
      ratio: measured / reference,
      fractionalDeviation: (measured - reference) / reference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measured: 12, reference: 10 },
  output: { ratio: 1.2, fractionalDeviation: 0.2 },
} satisfies ToolExample<Input, Output>;
export const geochemicalReferenceDeviationFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geochemistry/geochemical-reference-deviation-factor",
      title: "Geochemical Reference Deviation Factor Tool",
      description:
        "Calculate geochemical reference deviation factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measured: { type: "number" },
          reference: { type: "number" },
        },
        required: ["measured", "reference"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ratio: { type: "number" },
          fractionalDeviation: { type: "number" },
        },
        required: ["ratio", "fractionalDeviation"],
      },
      ports: {
        inputs: [
          {
            id: "measured",
            label: "Measured",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reference",
            label: "Reference",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "ratio", label: "Ratio", valueType: { type: "number" } },
          {
            id: "fractionalDeviation",
            label: "Fractional Deviation",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = geochemicalReferenceDeviationFactorTool.execute;
export default geochemicalReferenceDeviationFactorTool;
