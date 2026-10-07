import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frequencyWavenumbers: number;
  readonly imaginary: boolean;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frequencyWavenumbers: { type: "number", minimum: 0 },
    imaginary: { type: "boolean" },
  },
  required: ["frequencyWavenumbers", "imaginary"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Format an explicitly supplied vibrational frequency magnitude and imaginary-mode flag without inferring molecular stability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frequencyWavenumbers, imaginary } = request;
  const compute = (): Output => {
    H.domain(frequencyWavenumbers >= 0, "frequencyWavenumbers");
    return { token: frequencyWavenumbers + (imaginary ? "i" : "") + " cm^-1" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frequencyWavenumbers: 125, imaginary: true },
  output: { token: "125i cm^-1" },
} satisfies ToolExample<Input, Output>;
export const vibrationalFrequencyImaginaryTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "computational-chemistry",
        "computational chemistry",
        "chemistry",
      ],
      keywords: ["computational chemistry", "chemistry"],
    },
    id: "computational-chemistry/vibrational-frequency-imaginary-token",
    title: "Vibrational Frequency Imaginary Token",
    description:
      "Format an explicitly supplied vibrational frequency magnitude and imaginary-mode flag without inferring molecular stability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frequencyWavenumbers: { type: "number", minimum: 0 },
        imaginary: { type: "boolean" },
      },
      required: ["frequencyWavenumbers", "imaginary"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "frequencyWavenumbers",
          label: "Frequency Wavenumbers",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "imaginary",
          label: "Imaginary",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = vibrationalFrequencyImaginaryTokenTool.execute;
export default vibrationalFrequencyImaginaryTokenTool;
