import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly exponent: number };
export type Output = { readonly real: number; readonly imaginary: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { exponent: { type: "integer" } },
  required: ["exponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { real: { type: "number" }, imaginary: { type: "number" } },
  required: ["real", "imaginary"],
} as const;
/** Calculate cubic root unity filter term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { exponent } = input;
  const compute = (): Output => {
    const r = H.mod(exponent, 3);
    return {
      real: r === 0 ? 1 : -0.5,
      imaginary: r === 0 ? 0 : ((r === 1 ? 1 : -1) * Math.sqrt(3)) / 2,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { exponent: 3 },
  output: { real: 1, imaginary: 0 },
} satisfies ToolExample<Input, Output>;
export const cubicRootUnityFilterTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/cubic-root-unity-filter-term",
    title: "Cubic Root Unity Filter Term Tool",
    description:
      "Calculate cubic root unity filter term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { exponent: { type: "integer" } },
      required: ["exponent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { real: { type: "number" }, imaginary: { type: "number" } },
      required: ["real", "imaginary"],
    },
    ports: {
      inputs: [
        {
          id: "exponent",
          label: "Exponent",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "real", label: "Real", valueType: { type: "number" } },
        { id: "imaginary", label: "Imaginary", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cubicRootUnityFilterTermTool.execute;
export default cubicRootUnityFilterTermTool;
