import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dots: readonly boolean[];
  readonly reverseSurface: boolean;
};
export type Output = { readonly orientedDots: readonly boolean[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dots: {
      type: "array",
      maxItems: 6,
      items: { type: "boolean" },
      minItems: 6,
    },
    reverseSurface: { type: "boolean" },
  },
  required: ["dots", "reverseSurface"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orientedDots: {
      type: "array",
      maxItems: 6,
      items: { type: "boolean" },
      minItems: 6,
    },
  },
  required: ["orientedDots"],
} as const;
/** Mirror an explicitly supplied six-dot Braille cell between front and reverse surfaces using standard 1-2-3 left and 4-5-6 right dot order, without decoding text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dots, reverseSurface } = request;
  const compute = (): Output => {
    H.domain(dots.length === 6, "dots");
    return {
      orientedDots: reverseSurface
        ? [dots[3], dots[4], dots[5], dots[0], dots[1], dots[2]]
        : [...dots],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dots: [true, false, false, false, true, false],
    reverseSurface: true,
  },
  output: { orientedDots: [false, true, false, true, false, false] },
} satisfies ToolExample<Input, Output>;
export const brailleCellSurfaceOrientationPermutationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["disability-studies", "disability studies", "social sciences"],
        keywords: ["disability studies", "social sciences"],
      },
      id: "disability-studies/braille-cell-surface-orientation-permutation",
      title: "Braille Cell Surface Orientation Permutation",
      description:
        "Mirror an explicitly supplied six-dot Braille cell between front and reverse surfaces using standard 1-2-3 left and 4-5-6 right dot order, without decoding text.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dots: {
            type: "array",
            maxItems: 6,
            items: { type: "boolean" },
            minItems: 6,
          },
          reverseSurface: { type: "boolean" },
        },
        required: ["dots", "reverseSurface"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          orientedDots: {
            type: "array",
            maxItems: 6,
            items: { type: "boolean" },
            minItems: 6,
          },
        },
        required: ["orientedDots"],
      },
      ports: {
        inputs: [
          {
            id: "dots",
            label: "Dots",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
          {
            id: "reverseSurface",
            label: "Reverse Surface",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "orientedDots",
            label: "Oriented Dots",
            valueType: { type: "list", items: { type: "boolean" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = brailleCellSurfaceOrientationPermutationTool.execute;
export default brailleCellSurfaceOrientationPermutationTool;
