import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volume: number;
  readonly unitFactor: number;
  readonly dilutionFactor: number;
};
export type Output = { readonly equivalentVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "number", minimum: 0 },
    unitFactor: { type: "number", exclusiveMinimum: 0 },
    dilutionFactor: { type: "number", minimum: 1 },
  },
  required: ["volume", "unitFactor", "dilutionFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equivalentVolume: { type: "number" } },
  required: ["equivalentVolume"],
} as const;
/** Apply explicit volume and dilution accounting to a research sample. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volume, unitFactor, dilutionFactor } = request;
  const compute = (): Output => {
    H.domain(volume >= 0 && dilutionFactor >= 1);
    H.positive(unitFactor);
    return { equivalentVolume: volume * unitFactor * dilutionFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volume: 2, unitFactor: 0.001, dilutionFactor: 5 },
  output: { equivalentVolume: 0.01 },
} satisfies ToolExample<Input, Output>;
export const renalSampleVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nephrology/renal-sample-volume-factor",
    title: "Renal Sample Volume Factor Tool",
    description:
      "Apply explicit volume and dilution accounting to a research sample.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volume: { type: "number", minimum: 0 },
        unitFactor: { type: "number", exclusiveMinimum: 0 },
        dilutionFactor: { type: "number", minimum: 1 },
      },
      required: ["volume", "unitFactor", "dilutionFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { equivalentVolume: { type: "number" } },
      required: ["equivalentVolume"],
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
          id: "unitFactor",
          label: "Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dilutionFactor",
          label: "Dilution Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "equivalentVolume",
          label: "Equivalent Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = renalSampleVolumeFactorTool.execute;
export default renalSampleVolumeFactorTool;
