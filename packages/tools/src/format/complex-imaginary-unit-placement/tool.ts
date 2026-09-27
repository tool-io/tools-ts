import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly real: number;
  readonly imaginary: number;
  readonly unitBefore: boolean;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    real: { type: "number" },
    imaginary: { type: "number" },
    unitBefore: { type: "boolean" },
  },
  required: ["real", "imaginary", "unitBefore"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate complex imaginary unit placement from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { real, imaginary, unitBefore } = request;
  const compute = (): Output => {
    const coefficient = Math.abs(imaginary),
      part = unitBefore ? "i" + coefficient : coefficient + "i";
    return { text: String(real) + (imaginary < 0 ? " - " : " + ") + part };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { real: 3, imaginary: -4, unitBefore: false },
  output: { text: "3 - 4i" },
} satisfies ToolExample<Input, Output>;
export const complexImaginaryUnitPlacementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/complex-imaginary-unit-placement",
    title: "Complex Imaginary Unit Placement Tool",
    description:
      "Calculate complex imaginary unit placement from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        real: { type: "number" },
        imaginary: { type: "number" },
        unitBefore: { type: "boolean" },
      },
      required: ["real", "imaginary", "unitBefore"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    ports: {
      inputs: [
        {
          id: "real",
          label: "Real",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "imaginary",
          label: "Imaginary",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitBefore",
          label: "Unit Before",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = complexImaginaryUnitPlacementTool.execute;
export default complexImaginaryUnitPlacementTool;
