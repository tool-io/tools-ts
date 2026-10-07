import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly diagonalElement: number;
  readonly suppliedOccupationMultiplier: number;
};
export type Output = { readonly occupationContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diagonalElement: { type: "number" },
    suppliedOccupationMultiplier: { type: "number", minimum: 0 },
  },
  required: ["diagonalElement", "suppliedOccupationMultiplier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { occupationContribution: { type: "number" } },
  required: ["occupationContribution"],
} as const;
/** Scale a supplied orthonormal-basis density-matrix diagonal element by an explicit occupation multiplier; no overlap-population analysis is performed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diagonalElement, suppliedOccupationMultiplier } = request;
  const compute = (): Output => {
    H.domain(suppliedOccupationMultiplier >= 0, "suppliedOccupationMultiplier");
    return {
      occupationContribution: diagonalElement * suppliedOccupationMultiplier,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { diagonalElement: 0.75, suppliedOccupationMultiplier: 2 },
  output: { occupationContribution: 1.5 },
} satisfies ToolExample<Input, Output>;
export const densityMatrixOccupationDiagonalTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "computational-chemistry",
          "computational chemistry",
          "chemistry",
        ],
        keywords: ["computational chemistry", "chemistry"],
      },
      id: "computational-chemistry/density-matrix-occupation-diagonal-term",
      title: "Density Matrix Occupation Diagonal Term",
      description:
        "Scale a supplied orthonormal-basis density-matrix diagonal element by an explicit occupation multiplier; no overlap-population analysis is performed.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          diagonalElement: { type: "number" },
          suppliedOccupationMultiplier: { type: "number", minimum: 0 },
        },
        required: ["diagonalElement", "suppliedOccupationMultiplier"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { occupationContribution: { type: "number" } },
        required: ["occupationContribution"],
      },
      ports: {
        inputs: [
          {
            id: "diagonalElement",
            label: "Diagonal Element",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedOccupationMultiplier",
            label: "Supplied Occupation Multiplier",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "occupationContribution",
            label: "Occupation Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = densityMatrixOccupationDiagonalTermTool.execute;
export default densityMatrixOccupationDiagonalTermTool;
