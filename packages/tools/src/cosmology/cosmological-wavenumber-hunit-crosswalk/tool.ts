import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly numericHPerMpc: number; readonly h: number };
export type Output = {
  readonly perMpc: number;
  readonly numericMpcOverHWavelength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numericHPerMpc: { type: "number", exclusiveMinimum: 0 },
    h: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["numericHPerMpc", "h"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perMpc: { type: "number" },
    numericMpcOverHWavelength: { type: "number" },
  },
  required: ["perMpc", "numericMpcOverHWavelength"],
} as const;
/** Convert a quoted k in h/Mpc to 1/Mpc; wavelength uses 2*pi/k and is quoted in Mpc/h. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numericHPerMpc, h } = request;
  const compute = (): Output => {
    H.positive(numericHPerMpc);
    H.positive(h);
    return {
      perMpc: numericHPerMpc * h,
      numericMpcOverHWavelength: (2 * Math.PI) / numericHPerMpc,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { numericHPerMpc: 0.2, h: 0.7 },
  output: {
    perMpc: 0.13999999999999999,
    numericMpcOverHWavelength: 31.41592653589793,
  },
} satisfies ToolExample<Input, Output>;
export const cosmologicalWavenumberHunitCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cosmology/cosmological-wavenumber-hunit-crosswalk",
      title: "Cosmological Wavenumber Hunit Crosswalk Tool",
      description:
        "Convert a quoted k in h/Mpc to 1/Mpc; wavelength uses 2*pi/k and is quoted in Mpc/h.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          numericHPerMpc: { type: "number", exclusiveMinimum: 0 },
          h: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["numericHPerMpc", "h"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          perMpc: { type: "number" },
          numericMpcOverHWavelength: { type: "number" },
        },
        required: ["perMpc", "numericMpcOverHWavelength"],
      },
      ports: {
        inputs: [
          {
            id: "numericHPerMpc",
            label: "Numeric HPer Mpc",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "h",
            label: "H",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "perMpc", label: "Per Mpc", valueType: { type: "number" } },
          {
            id: "numericMpcOverHWavelength",
            label: "Numeric Mpc Over HWavelength",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cosmologicalWavenumberHunitCrosswalkTool.execute;
export default cosmologicalWavenumberHunitCrosswalkTool;
