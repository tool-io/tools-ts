import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly fraction: number;
  readonly compensate: boolean;
};
export type Output = { readonly modelLength: number; readonly scale: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", minimum: 0 },
    fraction: { type: "number", exclusiveMinimum: -1 },
    compensate: { type: "boolean" },
  },
  required: ["length", "fraction", "compensate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { modelLength: { type: "number" }, scale: { type: "number" } },
  required: ["modelLength", "scale"],
} as const;
/** Calculate dental cast expansion linear factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, fraction, compensate } = request;
  const compute = (): Output => {
    H.domain(length >= 0 && fraction > -1);
    return {
      modelLength: compensate
        ? length / (1 + fraction)
        : length * (1 + fraction),
      scale: compensate ? 1 / (1 + fraction) : 1 + fraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 100, fraction: 0.02, compensate: false },
  output: { modelLength: 102, scale: 1.02 },
} satisfies ToolExample<Input, Output>;
export const dentalCastExpansionLinearFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "prosthodontics/dental-cast-expansion-linear-factor",
    title: "Dental Cast Expansion Linear Factor Tool",
    description:
      "Calculate dental cast expansion linear factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number", minimum: 0 },
        fraction: { type: "number", exclusiveMinimum: -1 },
        compensate: { type: "boolean" },
      },
      required: ["length", "fraction", "compensate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modelLength: { type: "number" },
        scale: { type: "number" },
      },
      required: ["modelLength", "scale"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fraction",
          label: "Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "compensate",
          label: "Compensate",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "modelLength",
          label: "Model Length",
          valueType: { type: "number" },
        },
        { id: "scale", label: "Scale", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = dentalCastExpansionLinearFactorTool.execute;
export default dentalCastExpansionLinearFactorTool;
