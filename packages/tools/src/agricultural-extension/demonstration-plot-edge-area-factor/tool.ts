import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossArea: number;
  readonly edgeArea: number;
  readonly suppliedEdgeFactor: number;
};
export type Output = {
  readonly weightedArea: number;
  readonly excludedEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossArea: { type: "number", minimum: 0 },
    edgeArea: { type: "number", minimum: 0 },
    suppliedEdgeFactor: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["grossArea", "edgeArea", "suppliedEdgeFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedArea: { type: "number" },
    excludedEquivalent: { type: "number" },
  },
  required: ["weightedArea", "excludedEquivalent"],
} as const;
/** Calculate demonstration plot edge area factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossArea, edgeArea, suppliedEdgeFactor } = request;
  const compute = (): Output => {
    H.probability(suppliedEdgeFactor);
    H.domain(grossArea >= 0 && edgeArea >= 0 && edgeArea <= grossArea);
    return {
      weightedArea: grossArea - edgeArea + edgeArea * suppliedEdgeFactor,
      excludedEquivalent: edgeArea * (1 - suppliedEdgeFactor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossArea: 100, edgeArea: 20, suppliedEdgeFactor: 0.5 },
  output: { weightedArea: 90, excludedEquivalent: 10 },
} satisfies ToolExample<Input, Output>;
export const demonstrationPlotEdgeAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-extension/demonstration-plot-edge-area-factor",
    title: "Demonstration Plot Edge Area Factor Tool",
    description:
      "Calculate demonstration plot edge area factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossArea: { type: "number", minimum: 0 },
        edgeArea: { type: "number", minimum: 0 },
        suppliedEdgeFactor: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["grossArea", "edgeArea", "suppliedEdgeFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedArea: { type: "number" },
        excludedEquivalent: { type: "number" },
      },
      required: ["weightedArea", "excludedEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "grossArea",
          label: "Gross Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "edgeArea",
          label: "Edge Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedEdgeFactor",
          label: "Supplied Edge Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedArea",
          label: "Weighted Area",
          valueType: { type: "number" },
        },
        {
          id: "excludedEquivalent",
          label: "Excluded Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = demonstrationPlotEdgeAreaFactorTool.execute;
export default demonstrationPlotEdgeAreaFactorTool;
