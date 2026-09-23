import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly openPenalty: number;
  readonly extendPenalty: number;
  readonly extendFirst: boolean;
};
export type Output = {
  readonly penalty: number;
  readonly extensionCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 1 },
    openPenalty: { type: "number", minimum: 0 },
    extendPenalty: { type: "number", minimum: 0 },
    extendFirst: { type: "boolean" },
  },
  required: ["length", "openPenalty", "extendPenalty", "extendFirst"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    penalty: { type: "number" },
    extensionCount: { type: "integer" },
  },
  required: ["penalty", "extensionCount"],
} as const;
/** One affine gap run with an explicit choice whether extension is charged on its first position. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, openPenalty, extendPenalty, extendFirst } = request;
  const compute = (): Output => {
    H.integer(length, 1);
    H.domain(openPenalty >= 0 && extendPenalty >= 0);
    return {
      penalty: openPenalty + (length - (extendFirst ? 0 : 1)) * extendPenalty,
      extensionCount: length - (extendFirst ? 0 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 3, openPenalty: 5, extendPenalty: 2, extendFirst: false },
  output: { penalty: 9, extensionCount: 2 },
} satisfies ToolExample<Input, Output>;
export const alignmentGapOpenExtensionOneRunTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/alignment-gap-open-extension-one-run",
    title: "Alignment Gap Open Extension One Run Tool",
    description:
      "One affine gap run with an explicit choice whether extension is charged on its first position.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 1 },
        openPenalty: { type: "number", minimum: 0 },
        extendPenalty: { type: "number", minimum: 0 },
        extendFirst: { type: "boolean" },
      },
      required: ["length", "openPenalty", "extendPenalty", "extendFirst"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        penalty: { type: "number" },
        extensionCount: { type: "integer" },
      },
      required: ["penalty", "extensionCount"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "openPenalty",
          label: "Open Penalty",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extendPenalty",
          label: "Extend Penalty",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extendFirst",
          label: "Extend First",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "penalty", label: "Penalty", valueType: { type: "number" } },
        {
          id: "extensionCount",
          label: "Extension Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = alignmentGapOpenExtensionOneRunTool.execute;
export default alignmentGapOpenExtensionOneRunTool;
