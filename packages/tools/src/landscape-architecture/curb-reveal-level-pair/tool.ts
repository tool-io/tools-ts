import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly curbTopLevel: number;
  readonly adjacentSurfaceLevel: number;
};
export type Output = { readonly reveal: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    curbTopLevel: { type: "number" },
    adjacentSurfaceLevel: { type: "number" },
  },
  required: ["curbTopLevel", "adjacentSurfaceLevel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reveal: { type: "number" } },
  required: ["reveal"],
} as const;
/** Measure signed curb reveal above an adjacent surface on one common elevation datum. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { curbTopLevel, adjacentSurfaceLevel } = request;
  const compute = (): Output => {
    return { reveal: curbTopLevel - adjacentSurfaceLevel };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { curbTopLevel: 1.15, adjacentSurfaceLevel: 1 },
  output: { reveal: 0.1499999999999999 },
} satisfies ToolExample<Input, Output>;
export const curbRevealLevelPairTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "landscape-architecture/curb-reveal-level-pair",
      title: "Curb Reveal Level Pair Tool",
      description:
        "Measure signed curb reveal above an adjacent surface on one common elevation datum.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          curbTopLevel: { type: "number" },
          adjacentSurfaceLevel: { type: "number" },
        },
        required: ["curbTopLevel", "adjacentSurfaceLevel"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { reveal: { type: "number" } },
        required: ["reveal"],
      },
      ports: {
        inputs: [
          {
            id: "curbTopLevel",
            label: "Curb Top Level",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "adjacentSurfaceLevel",
            label: "Adjacent Surface Level",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "reveal", label: "Reveal", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  },
);
export const run = curbRevealLevelPairTool.execute;
export default curbRevealLevelPairTool;
