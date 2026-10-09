import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signedWidth: number;
  readonly signedHeight: number;
};
export type Output = {
  readonly unitX: number;
  readonly unitY: number;
  readonly diagonalLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedWidth: { type: "number" },
    signedHeight: { type: "number" },
  },
  required: ["signedWidth", "signedHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitX: { type: "number" },
    unitY: { type: "number" },
    diagonalLength: { type: "number" },
  },
  required: ["unitX", "unitY", "diagonalLength"],
} as const;
/** Normalize an explicit nonzero signed rectangle diagonal into a Euclidean unit direction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signedWidth, signedHeight } = request;
  const compute = (): Output => {
    H.domain(signedWidth !== 0 || signedHeight !== 0, "signedWidth");
    return (() => {
      const diagonalLength = Math.hypot(signedWidth, signedHeight);
      return {
        unitX: signedWidth / diagonalLength,
        unitY: signedHeight / diagonalLength,
        diagonalLength,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signedWidth: 3, signedHeight: 4 },
  output: { unitX: 0.6, unitY: 0.8, diagonalLength: 5 },
} satisfies ToolExample<Input, Output>;
export const rectangleDiagonalUnitDirectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geometry", "mathematics"],
      keywords: ["geometry", "mathematics"],
    },
    id: "geometry/rectangle-diagonal-unit-direction",
    title: "Rectangle Diagonal Unit Direction",
    description:
      "Normalize an explicit nonzero signed rectangle diagonal into a Euclidean unit direction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedWidth: { type: "number" },
        signedHeight: { type: "number" },
      },
      required: ["signedWidth", "signedHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitX: { type: "number" },
        unitY: { type: "number" },
        diagonalLength: { type: "number" },
      },
      required: ["unitX", "unitY", "diagonalLength"],
    },
    ports: {
      inputs: [
        {
          id: "signedWidth",
          label: "Signed Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "signedHeight",
          label: "Signed Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "unitX", label: "Unit X", valueType: { type: "number" } },
        { id: "unitY", label: "Unit Y", valueType: { type: "number" } },
        {
          id: "diagonalLength",
          label: "Diagonal Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rectangleDiagonalUnitDirectionTool.execute;
export default rectangleDiagonalUnitDirectionTool;
