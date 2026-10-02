import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialThickness: number;
  readonly trimLosses: readonly number[];
  readonly sectionThickness: number;
};
export type Output = {
  readonly remainingThickness: number;
  readonly sectionEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialThickness: { type: "number", minimum: 0 },
    trimLosses: { type: "array", maxItems: 256, items: { type: "number" } },
    sectionThickness: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["initialThickness", "trimLosses", "sectionThickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingThickness: { type: "number" },
    sectionEquivalent: { type: "number" },
  },
  required: ["remainingThickness", "sectionEquivalent"],
} as const;
/** A supplied block-thickness budget, without instructions for specimen preparation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialThickness, trimLosses, sectionThickness } = request;
  const compute = (): Output => {
    H.positive(sectionThickness);
    H.domain(
      initialThickness >= 0 &&
        trimLosses.every((x) => x >= 0) &&
        trimLosses.reduce((a, b) => a + b, 0) <= initialThickness,
    );
    return {
      remainingThickness:
        initialThickness - trimLosses.reduce((a, b) => a + b, 0),
      sectionEquivalent:
        (initialThickness - trimLosses.reduce((a, b) => a + b, 0)) /
        sectionThickness,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialThickness: 100, trimLosses: [10, 20], sectionThickness: 5 },
  output: { remainingThickness: 70, sectionEquivalent: 14 },
} satisfies ToolExample<Input, Output>;
export const tissueBlockTrimLossRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pathology/tissue-block-trim-loss-remainder",
    title: "Tissue Block Trim Loss Remainder Tool",
    description:
      "A supplied block-thickness budget, without instructions for specimen preparation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialThickness: { type: "number", minimum: 0 },
        trimLosses: { type: "array", maxItems: 256, items: { type: "number" } },
        sectionThickness: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["initialThickness", "trimLosses", "sectionThickness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingThickness: { type: "number" },
        sectionEquivalent: { type: "number" },
      },
      required: ["remainingThickness", "sectionEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "initialThickness",
          label: "Initial Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trimLosses",
          label: "Trim Losses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sectionThickness",
          label: "Section Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingThickness",
          label: "Remaining Thickness",
          valueType: { type: "number" },
        },
        {
          id: "sectionEquivalent",
          label: "Section Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tissueBlockTrimLossRemainderTool.execute;
export default tissueBlockTrimLossRemainderTool;
