import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly weight: number; readonly commonScale: number };
export type Output = {
  readonly scaledWeight: number;
  readonly invariant: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weight: { type: "number" }, commonScale: { type: "number" } },
  required: ["weight", "commonScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaledWeight: { type: "number" },
    invariant: { type: "boolean" },
  },
  required: ["scaledWeight", "invariant"],
} as const;
/** Scale one barycentric weight by the same nonzero factor used for every node; normalized interpolation is invariant. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { weight, commonScale } = input;
  const compute = (): Output => {
    H.domain(commonScale !== 0);
    return { scaledWeight: weight * commonScale, invariant: true };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { weight: 2, commonScale: -3 },
  output: { scaledWeight: -6, invariant: true },
} satisfies ToolExample<Input, Output>;
export const barycentricNodeWeightCommonScaleInvarianceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "interpolation/barycentric-node-weight-common-scale-invariance",
      title: "Barycentric Node Weight Common Scale Invariance Tool",
      description:
        "Scale one barycentric weight by the same nonzero factor used for every node; normalized interpolation is invariant.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          weight: { type: "number" },
          commonScale: { type: "number" },
        },
        required: ["weight", "commonScale"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          scaledWeight: { type: "number" },
          invariant: { type: "boolean" },
        },
        required: ["scaledWeight", "invariant"],
      },
      ports: {
        inputs: [
          {
            id: "weight",
            label: "Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "commonScale",
            label: "Common Scale",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "scaledWeight",
            label: "Scaled Weight",
            valueType: { type: "number" },
          },
          {
            id: "invariant",
            label: "Invariant",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = barycentricNodeWeightCommonScaleInvarianceTool.execute;
export default barycentricNodeWeightCommonScaleInvarianceTool;
