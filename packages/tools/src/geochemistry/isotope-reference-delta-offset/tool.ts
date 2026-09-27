import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDelta: number;
  readonly firstReferenceRatio: number;
  readonly secondReferenceRatio: number;
};
export type Output = { readonly secondDelta: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDelta: { type: "number", minimum: -1000 },
    firstReferenceRatio: { type: "number", exclusiveMinimum: 0 },
    secondReferenceRatio: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstDelta", "firstReferenceRatio", "secondReferenceRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { secondDelta: { type: "number" } },
  required: ["secondDelta"],
} as const;
/** Rebase isotope delta notation in per mille using two explicit compatible reference ratios. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDelta, firstReferenceRatio, secondReferenceRatio } = request;
  const compute = (): Output => {
    H.domain(firstDelta >= -1000);
    H.positive(firstReferenceRatio);
    H.positive(secondReferenceRatio);
    return {
      secondDelta:
        (((1 + firstDelta / 1000) * firstReferenceRatio) /
          secondReferenceRatio -
          1) *
        1000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDelta: 0, firstReferenceRatio: 2, secondReferenceRatio: 1 },
  output: { secondDelta: 1000 },
} satisfies ToolExample<Input, Output>;
export const isotopeReferenceDeltaOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/isotope-reference-delta-offset",
    title: "Isotope Reference Delta Offset Tool",
    description:
      "Rebase isotope delta notation in per mille using two explicit compatible reference ratios.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDelta: { type: "number", minimum: -1000 },
        firstReferenceRatio: { type: "number", exclusiveMinimum: 0 },
        secondReferenceRatio: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstDelta", "firstReferenceRatio", "secondReferenceRatio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { secondDelta: { type: "number" } },
      required: ["secondDelta"],
    },
    ports: {
      inputs: [
        {
          id: "firstDelta",
          label: "First Delta",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstReferenceRatio",
          label: "First Reference Ratio",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "secondReferenceRatio",
          label: "Second Reference Ratio",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "secondDelta",
          label: "Second Delta",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = isotopeReferenceDeltaOffsetTool.execute;
export default isotopeReferenceDeltaOffsetTool;
