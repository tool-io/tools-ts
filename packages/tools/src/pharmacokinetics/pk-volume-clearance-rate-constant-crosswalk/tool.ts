import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly clearance: number; readonly volume: number };
export type Output = {
  readonly eliminationRate: number;
  readonly halfLife: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clearance: { type: "number", exclusiveMinimum: 0 },
    volume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["clearance", "volume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eliminationRate: { type: "number" },
    halfLife: { type: "number" },
  },
  required: ["eliminationRate", "halfLife"],
} as const;
/** Explicit one-compartment research parameter crosswalk. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { clearance, volume } = request;
  const compute = (): Output => {
    H.positive(clearance);
    H.positive(volume);
    return {
      eliminationRate: clearance / volume,
      halfLife: (Math.LN2 * volume) / clearance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { clearance: 5, volume: 20 },
  output: { eliminationRate: 0.25, halfLife: 2.772588722239781 },
} satisfies ToolExample<Input, Output>;
export const pkVolumeClearanceRateConstantCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacokinetics/pk-volume-clearance-rate-constant-crosswalk",
      title: "PK Volume Clearance Rate Constant Crosswalk Tool",
      description: "Explicit one-compartment research parameter crosswalk.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          clearance: { type: "number", exclusiveMinimum: 0 },
          volume: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["clearance", "volume"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eliminationRate: { type: "number" },
          halfLife: { type: "number" },
        },
        required: ["eliminationRate", "halfLife"],
      },
      ports: {
        inputs: [
          {
            id: "clearance",
            label: "Clearance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "volume",
            label: "Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "eliminationRate",
            label: "Elimination Rate",
            valueType: { type: "number" },
          },
          { id: "halfLife", label: "Half Life", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = pkVolumeClearanceRateConstantCrosswalkTool.execute;
export default pkVolumeClearanceRateConstantCrosswalkTool;
