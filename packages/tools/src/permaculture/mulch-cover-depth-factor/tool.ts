import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coveredArea: number;
  readonly depth: number;
  readonly coverageFraction: number;
};
export type Output = { readonly volume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredArea: { type: "number", minimum: 0 },
    depth: { type: "number", minimum: 0 },
    coverageFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["coveredArea", "depth", "coverageFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volume: { type: "number" } },
  required: ["volume"],
} as const;
/** Calculate mulch cover depth factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coveredArea, depth, coverageFraction } = request;
  const compute = (): Output => {
    H.domain(coveredArea >= 0 && depth >= 0);
    H.probability(coverageFraction);
    return { volume: coveredArea * depth * coverageFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coveredArea: 20, depth: 0.1, coverageFraction: 0.5 },
  output: { volume: 1 },
} satisfies ToolExample<Input, Output>;
export const mulchCoverDepthFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/mulch-cover-depth-factor",
    title: "Mulch Cover Depth Factor Tool",
    description:
      "Calculate mulch cover depth factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coveredArea: { type: "number", minimum: 0 },
        depth: { type: "number", minimum: 0 },
        coverageFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["coveredArea", "depth", "coverageFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volume: { type: "number" } },
      required: ["volume"],
    },
    ports: {
      inputs: [
        {
          id: "coveredArea",
          label: "Covered Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coverageFraction",
          label: "Coverage Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "volume", label: "Volume", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = mulchCoverDepthFactorTool.execute;
export default mulchCoverDepthFactorTool;
