import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chargePerArea: number;
  readonly particleCharge: number;
};
export type Output = { readonly particlesPerArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chargePerArea: { type: "number" },
    particleCharge: { type: "number" },
  },
  required: ["chargePerArea", "particleCharge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { particlesPerArea: { type: "number" } },
  required: ["particlesPerArea"],
} as const;
/** Convert signed surface charge density to number density for the supplied nonzero signed particle charge. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { chargePerArea, particleCharge } = input;
  const compute = (): Output => {
    H.domain(particleCharge !== 0);
    return { particlesPerArea: chargePerArea / particleCharge };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { chargePerArea: 12, particleCharge: 2 },
  output: { particlesPerArea: 6 },
} satisfies ToolExample<Input, Output>;
export const surfaceChargeNumberDensityCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/surface-charge-number-density-crosswalk",
      title: "Surface Charge Number Density Crosswalk Tool",
      description:
        "Convert signed surface charge density to number density for the supplied nonzero signed particle charge.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          chargePerArea: { type: "number" },
          particleCharge: { type: "number" },
        },
        required: ["chargePerArea", "particleCharge"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { particlesPerArea: { type: "number" } },
        required: ["particlesPerArea"],
      },
      ports: {
        inputs: [
          {
            id: "chargePerArea",
            label: "Charge Per Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "particleCharge",
            label: "Particle Charge",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "particlesPerArea",
            label: "Particles Per Area",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = surfaceChargeNumberDensityCrosswalkTool.execute;
export default surfaceChargeNumberDensityCrosswalkTool;
