import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gapWidths: readonly number[];
  readonly retainedWidth: number;
};
export type Output = {
  readonly missingWidth: number;
  readonly reconstructedWidth: number;
  readonly missingShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gapWidths: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    retainedWidth: { type: "number", minimum: 0 },
  },
  required: ["gapWidths", "retainedWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingWidth: { type: "number" },
    reconstructedWidth: { type: "number" },
    missingShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["missingWidth", "reconstructedWidth", "missingShare", "defined"],
} as const;
/** Compare explicitly measured gaps and retained inscription width without restoring text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gapWidths, retainedWidth } = request;
  const compute = (): Output => {
    H.domain(retainedWidth >= 0 && gapWidths.every((x) => x >= 0));
    return (() => {
      const missingWidth = gapWidths.reduce((a, b) => a + b, 0),
        reconstructedWidth = missingWidth + retainedWidth;
      return {
        missingWidth,
        reconstructedWidth,
        missingShare:
          reconstructedWidth > 0 ? missingWidth / reconstructedWidth : 0,
        defined: reconstructedWidth > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gapWidths: [2, 3], retainedWidth: 15 },
  output: {
    missingWidth: 5,
    reconstructedWidth: 20,
    missingShare: 0.25,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const inscriptionLacunaWidthRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "middle-eastern-studies/inscription-lacuna-width-ratio",
    title: "Inscription Lacuna Width Ratio Tool",
    description:
      "Compare explicitly measured gaps and retained inscription width without restoring text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapWidths: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        retainedWidth: { type: "number", minimum: 0 },
      },
      required: ["gapWidths", "retainedWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingWidth: { type: "number" },
        reconstructedWidth: { type: "number" },
        missingShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "missingWidth",
        "reconstructedWidth",
        "missingShare",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "gapWidths",
          label: "Gap Widths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "retainedWidth",
          label: "Retained Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "missingWidth",
          label: "Missing Width",
          valueType: { type: "number" },
        },
        {
          id: "reconstructedWidth",
          label: "Reconstructed Width",
          valueType: { type: "number" },
        },
        {
          id: "missingShare",
          label: "Missing Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = inscriptionLacunaWidthRatioTool.execute;
export default inscriptionLacunaWidthRatioTool;
