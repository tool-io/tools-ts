import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredForce: number;
  readonly preloadForce: number;
  readonly referenceForce: number;
};
export type Output = {
  readonly incrementalForce: number;
  readonly referenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredForce: { type: "number" },
    preloadForce: { type: "number" },
    referenceForce: { type: "number" },
  },
  required: ["measuredForce", "preloadForce", "referenceForce"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    incrementalForce: { type: "number" },
    referenceGap: { type: "number" },
  },
  required: ["incrementalForce", "referenceGap"],
} as const;
/** Subtract supplied bench preload and compare to a reference; no fitting or therapeutic force recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredForce, preloadForce, referenceForce } = request;
  const compute = (): Output => {
    return {
      incrementalForce: measuredForce - preloadForce,
      referenceGap: measuredForce - preloadForce - referenceForce,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredForce: 20, preloadForce: 5, referenceForce: 12 },
  output: { incrementalForce: 15, referenceGap: 3 },
} satisfies ToolExample<Input, Output>;
export const orthosisPreloadReferenceForceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthopedics/orthosis-preload-reference-force",
    title: "Orthosis Preload Reference Force Tool",
    description:
      "Subtract supplied bench preload and compare to a reference; no fitting or therapeutic force recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredForce: { type: "number" },
        preloadForce: { type: "number" },
        referenceForce: { type: "number" },
      },
      required: ["measuredForce", "preloadForce", "referenceForce"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        incrementalForce: { type: "number" },
        referenceGap: { type: "number" },
      },
      required: ["incrementalForce", "referenceGap"],
    },
    ports: {
      inputs: [
        {
          id: "measuredForce",
          label: "Measured Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "preloadForce",
          label: "Preload Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceForce",
          label: "Reference Force",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "incrementalForce",
          label: "Incremental Force",
          valueType: { type: "number" },
        },
        {
          id: "referenceGap",
          label: "Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = orthosisPreloadReferenceForceTool.execute;
export default orthosisPreloadReferenceForceTool;
