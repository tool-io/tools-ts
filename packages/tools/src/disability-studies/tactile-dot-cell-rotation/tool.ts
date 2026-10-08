import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dots: readonly boolean[];
  readonly halfTurn: boolean;
};
export type Output = { readonly rotatedDots: readonly boolean[] };
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
    halfTurn: { type: "boolean" },
  },
  required: ["dots", "halfTurn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rotatedDots: {
      type: "array",
      maxItems: 6,
      items: { type: "boolean" },
      minItems: 6,
    },
  },
  required: ["rotatedDots"],
} as const;
/** Rotate an explicit six-dot cell by 180 degrees in standard column-based dot order without interpreting a Braille character. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dots, halfTurn } = request;
  const compute = (): Output => {
    H.domain(dots.length === 6, "dots");
    return {
      rotatedDots: halfTurn
        ? [dots[5], dots[4], dots[3], dots[2], dots[1], dots[0]]
        : [...dots],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dots: [true, false, false, false, false, false], halfTurn: true },
  output: { rotatedDots: [false, false, false, false, false, true] },
} satisfies ToolExample<Input, Output>;
export const tactileDotCellRotationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["disability-studies", "disability studies", "social sciences"],
      keywords: ["disability studies", "social sciences"],
    },
    id: "disability-studies/tactile-dot-cell-rotation",
    title: "Tactile Dot Cell Rotation",
    description:
      "Rotate an explicit six-dot cell by 180 degrees in standard column-based dot order without interpreting a Braille character.",
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
        halfTurn: { type: "boolean" },
      },
      required: ["dots", "halfTurn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rotatedDots: {
          type: "array",
          maxItems: 6,
          items: { type: "boolean" },
          minItems: 6,
        },
      },
      required: ["rotatedDots"],
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
          id: "halfTurn",
          label: "Half Turn",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "rotatedDots",
          label: "Rotated Dots",
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
    },
  },
  calculate,
});
export const run = tactileDotCellRotationTool.execute;
export default tactileDotCellRotationTool;
