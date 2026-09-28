import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstNormal: readonly number[];
  readonly secondNormal: readonly number[];
};
export type Output = {
  readonly cosine: number;
  readonly internalRadians: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstNormal: { type: "array", maxItems: 256, items: { type: "number" } },
    secondNormal: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["firstNormal", "secondNormal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cosine: { type: "number" },
    internalRadians: { type: "number" },
  },
  required: ["cosine", "internalRadians"],
} as const;
/** Calculate prism dihedral normal dot term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { firstNormal, secondNormal } = input;
  const compute = (): Output => {
    H.domain(firstNormal.length === 3 && secondNormal.length === 3);
    const norms = Math.hypot(...firstNormal) * Math.hypot(...secondNormal);
    H.positive(norms);
    const cosine = Math.max(
      -1,
      Math.min(1, H.dot(firstNormal, secondNormal) / norms),
    );
    return { cosine, internalRadians: Math.PI - Math.acos(cosine) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { firstNormal: [1, 0, 0], secondNormal: [0, 1, 0] },
  output: { cosine: 0, internalRadians: 1.5707963267948966 },
} satisfies ToolExample<Input, Output>;
export const prismDihedralNormalDotTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/prism-dihedral-normal-dot-term",
    title: "Prism Dihedral Normal Dot Term Tool",
    description:
      "Calculate prism dihedral normal dot term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstNormal: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        secondNormal: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["firstNormal", "secondNormal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cosine: { type: "number" },
        internalRadians: { type: "number" },
      },
      required: ["cosine", "internalRadians"],
    },
    ports: {
      inputs: [
        {
          id: "firstNormal",
          label: "First Normal",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "secondNormal",
          label: "Second Normal",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "cosine", label: "Cosine", valueType: { type: "number" } },
        {
          id: "internalRadians",
          label: "Internal Radians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = prismDihedralNormalDotTermTool.execute;
export default prismDihedralNormalDotTermTool;
