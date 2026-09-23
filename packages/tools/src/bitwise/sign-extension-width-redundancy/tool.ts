import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly word: number;
  readonly width: number;
  readonly extensionWidth: number;
};
export type Output = {
  readonly extended: number;
  readonly redundantBits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    word: { type: "integer", minimum: 0 },
    width: { type: "integer", minimum: 1, maximum: 31 },
    extensionWidth: { type: "integer", maximum: 32 },
  },
  required: ["word", "width", "extensionWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extended: { type: "integer" },
    redundantBits: { type: "integer" },
  },
  required: ["extended", "redundantBits"],
} as const;
/** Calculate sign extension width redundancy from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { word, width, extensionWidth } = input;
  const compute = (): Output => {
    H.integer(width, 1, 31);
    H.integer(extensionWidth, width, 32);
    H.integer(word, 0, 2 ** width - 1);
    const signed = word >= 2 ** (width - 1) ? word - 2 ** width : word;
    return {
      extended: signed < 0 ? signed + 2 ** extensionWidth : signed,
      redundantBits: extensionWidth - width,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { word: 240, width: 8, extensionWidth: 16 },
  output: { extended: 65520, redundantBits: 8 },
} satisfies ToolExample<Input, Output>;
export const signExtensionWidthRedundancyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/sign-extension-width-redundancy",
    title: "Sign Extension Width Redundancy Tool",
    description:
      "Calculate sign extension width redundancy from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        word: { type: "integer", minimum: 0 },
        width: { type: "integer", minimum: 1, maximum: 31 },
        extensionWidth: { type: "integer", maximum: 32 },
      },
      required: ["word", "width", "extensionWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        extended: { type: "integer" },
        redundantBits: { type: "integer" },
      },
      required: ["extended", "redundantBits"],
    },
    ports: {
      inputs: [
        {
          id: "word",
          label: "Word",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "extensionWidth",
          label: "Extension Width",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "extended", label: "Extended", valueType: { type: "integer" } },
        {
          id: "redundantBits",
          label: "Redundant Bits",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = signExtensionWidthRedundancyTool.execute;
export default signExtensionWidthRedundancyTool;
