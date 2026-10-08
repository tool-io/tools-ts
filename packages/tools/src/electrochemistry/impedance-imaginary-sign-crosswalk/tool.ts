import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly storedImaginaryOhms: number;
  readonly storedAsNegativeImaginary: boolean;
};
export type Output = {
  readonly physicalImaginaryOhms: number;
  readonly nyquistNegativeImaginaryOhms: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    storedImaginaryOhms: { type: "number" },
    storedAsNegativeImaginary: { type: "boolean" },
  },
  required: ["storedImaginaryOhms", "storedAsNegativeImaginary"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    physicalImaginaryOhms: { type: "number" },
    nyquistNegativeImaginaryOhms: { type: "number" },
  },
  required: ["physicalImaginaryOhms", "nyquistNegativeImaginaryOhms"],
} as const;
/** Crosswalk an explicitly declared stored imaginary-impedance convention with physical Im(Z) and Nyquist −Im(Z). */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { storedImaginaryOhms, storedAsNegativeImaginary } = request;
  const compute = (): Output => {
    const physicalImaginaryOhms = storedAsNegativeImaginary
      ? -storedImaginaryOhms
      : storedImaginaryOhms;
    return {
      physicalImaginaryOhms,
      nyquistNegativeImaginaryOhms: -physicalImaginaryOhms,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { storedImaginaryOhms: 5, storedAsNegativeImaginary: true },
  output: { physicalImaginaryOhms: -5, nyquistNegativeImaginaryOhms: 5 },
} satisfies ToolExample<Input, Output>;
export const impedanceImaginarySignCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["electrochemistry", "chemistry"],
      keywords: ["electrochemistry", "chemistry"],
    },
    id: "electrochemistry/impedance-imaginary-sign-crosswalk",
    title: "Impedance Imaginary Sign Crosswalk",
    description:
      "Crosswalk an explicitly declared stored imaginary-impedance convention with physical Im(Z) and Nyquist −Im(Z).",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        storedImaginaryOhms: { type: "number" },
        storedAsNegativeImaginary: { type: "boolean" },
      },
      required: ["storedImaginaryOhms", "storedAsNegativeImaginary"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        physicalImaginaryOhms: { type: "number" },
        nyquistNegativeImaginaryOhms: { type: "number" },
      },
      required: ["physicalImaginaryOhms", "nyquistNegativeImaginaryOhms"],
    },
    ports: {
      inputs: [
        {
          id: "storedImaginaryOhms",
          label: "Stored Imaginary Ohms",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "storedAsNegativeImaginary",
          label: "Stored As Negative Imaginary",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "physicalImaginaryOhms",
          label: "Physical Imaginary Ohms",
          valueType: { type: "number" },
        },
        {
          id: "nyquistNegativeImaginaryOhms",
          label: "Nyquist Negative Imaginary Ohms",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = impedanceImaginarySignCrosswalkTool.execute;
export default impedanceImaginarySignCrosswalkTool;
