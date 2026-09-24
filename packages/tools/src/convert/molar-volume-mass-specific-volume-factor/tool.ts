import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly molarVolume: number;
  readonly molarMass: number;
};
export type Output = { readonly specificVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    molarVolume: { type: "number", minimum: 0 },
    molarMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["molarVolume", "molarMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { specificVolume: { type: "number" } },
  required: ["specificVolume"],
} as const;
/** Convert cubic metres per mole into cubic metres per kilogram. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { molarVolume, molarMass } = input;
  const compute = (): Output => {
    H.domain(molarVolume >= 0);
    H.positive(molarMass);
    return { specificVolume: molarVolume / molarMass };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { molarVolume: 0.024, molarMass: 0.03 },
  output: { specificVolume: 0.8 },
} satisfies ToolExample<Input, Output>;
export const molarVolumeMassSpecificVolumeFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/molar-volume-mass-specific-volume-factor",
      title: "Molar Volume Mass Specific Volume Factor Tool",
      description:
        "Convert cubic metres per mole into cubic metres per kilogram.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          molarVolume: { type: "number", minimum: 0 },
          molarMass: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["molarVolume", "molarMass"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { specificVolume: { type: "number" } },
        required: ["specificVolume"],
      },
      ports: {
        inputs: [
          {
            id: "molarVolume",
            label: "Molar Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "molarMass",
            label: "Molar Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "specificVolume",
            label: "Specific Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = molarVolumeMassSpecificVolumeFactorTool.execute;
export default molarVolumeMassSpecificVolumeFactorTool;
