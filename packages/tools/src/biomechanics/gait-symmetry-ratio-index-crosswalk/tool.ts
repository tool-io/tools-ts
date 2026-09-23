import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = {
  readonly ratio: number;
  readonly symmetryIndexPercent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number", minimum: 0 },
    second: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratio: { type: "number" },
    symmetryIndexPercent: { type: "number" },
  },
  required: ["ratio", "symmetryIndexPercent"],
} as const;
/** Signed 200*(first-second)/(first+second) index, with no absolute value or clinical threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.domain(first >= 0);
    H.positive(second);
    return {
      ratio: first / second,
      symmetryIndexPercent: (200 * (first - second)) / (first + second),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 12, second: 10 },
  output: { ratio: 1.2, symmetryIndexPercent: 18.181818181818183 },
} satisfies ToolExample<Input, Output>;
export const gaitSymmetryRatioIndexCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/gait-symmetry-ratio-index-crosswalk",
    title: "Gait Symmetry Ratio Index Crosswalk Tool",
    description:
      "Signed 200*(first-second)/(first+second) index, with no absolute value or clinical threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number", minimum: 0 },
        second: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratio: { type: "number" },
        symmetryIndexPercent: { type: "number" },
      },
      required: ["ratio", "symmetryIndexPercent"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        {
          id: "symmetryIndexPercent",
          label: "Symmetry Index Percent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gaitSymmetryRatioIndexCrosswalkTool.execute;
export default gaitSymmetryRatioIndexCrosswalkTool;
