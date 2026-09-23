import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly clusterWeight: number;
  readonly clusterSize: number;
};
export type Output = { readonly weightPerMember: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clusterWeight: { type: "number", minimum: 0 },
    clusterSize: { type: "integer", minimum: 1 },
  },
  required: ["clusterWeight", "clusterSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightPerMember: { type: "number" } },
  required: ["weightPerMember"],
} as const;
/** Calculate cluster weight size ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { clusterWeight, clusterSize } = request;
  const compute = (): Output => {
    H.domain(clusterWeight >= 0);
    H.integer(clusterSize, 1);
    return { weightPerMember: clusterWeight / clusterSize };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { clusterWeight: 3, clusterSize: 12 },
  output: { weightPerMember: 0.25 },
} satisfies ToolExample<Input, Output>;
export const clusterWeightSizeRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biostatistics/cluster-weight-size-ratio",
    title: "Cluster Weight Size Ratio Tool",
    description:
      "Calculate cluster weight size ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clusterWeight: { type: "number", minimum: 0 },
        clusterSize: { type: "integer", minimum: 1 },
      },
      required: ["clusterWeight", "clusterSize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weightPerMember: { type: "number" } },
      required: ["weightPerMember"],
    },
    ports: {
      inputs: [
        {
          id: "clusterWeight",
          label: "Cluster Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clusterSize",
          label: "Cluster Size",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "weightPerMember",
          label: "Weight Per Member",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = clusterWeightSizeRatioTool.execute;
export default clusterWeightSizeRatioTool;
