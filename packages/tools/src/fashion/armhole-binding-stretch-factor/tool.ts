import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opening: number;
  readonly relaxedBinding: number;
};
export type Output = {
  readonly extensionFraction: number;
  readonly installedFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "number", exclusiveMinimum: 0 },
    relaxedBinding: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["opening", "relaxedBinding"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extensionFraction: { type: "number" },
    installedFactor: { type: "number" },
  },
  required: ["extensionFraction", "installedFactor"],
} as const;
/** Calculate armhole binding stretch factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opening, relaxedBinding } = request;
  const compute = (): Output => {
    H.positive(opening);
    H.positive(relaxedBinding);
    return {
      extensionFraction: (opening - relaxedBinding) / relaxedBinding,
      installedFactor: opening / relaxedBinding,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { opening: 50, relaxedBinding: 40 },
  output: { extensionFraction: 0.25, installedFactor: 1.25 },
} satisfies ToolExample<Input, Output>;
export const armholeBindingStretchFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/armhole-binding-stretch-factor",
    title: "Armhole Binding Stretch Factor Tool",
    description:
      "Calculate armhole binding stretch factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        opening: { type: "number", exclusiveMinimum: 0 },
        relaxedBinding: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["opening", "relaxedBinding"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        extensionFraction: { type: "number" },
        installedFactor: { type: "number" },
      },
      required: ["extensionFraction", "installedFactor"],
    },
    ports: {
      inputs: [
        {
          id: "opening",
          label: "Opening",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "relaxedBinding",
          label: "Relaxed Binding",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "extensionFraction",
          label: "Extension Fraction",
          valueType: { type: "number" },
        },
        {
          id: "installedFactor",
          label: "Installed Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = armholeBindingStretchFactorTool.execute;
export default armholeBindingStretchFactorTool;
