import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly clusterPixelArea: number;
  readonly referencePixelLength: number;
  readonly referenceLength: number;
};
export type Output = { readonly clusterPhysicalArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clusterPixelArea: { type: "number", minimum: 0 },
    referencePixelLength: { type: "number", exclusiveMinimum: 0 },
    referenceLength: { type: "number", minimum: 0 },
  },
  required: ["clusterPixelArea", "referencePixelLength", "referenceLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { clusterPhysicalArea: { type: "number" } },
  required: ["clusterPhysicalArea"],
} as const;
/** Scale supplied amphibian egg-cluster image area by an explicit same-plane linear calibration without estimating egg counts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { clusterPixelArea, referencePixelLength, referenceLength } = request;
  const compute = (): Output => {
    H.domain(clusterPixelArea >= 0, "clusterPixelArea");
    (H.domain(
      Number.isFinite(referencePixelLength) && referencePixelLength > 0,
      "referencePixelLength",
    ),
      referencePixelLength);
    H.domain(referenceLength >= 0, "referenceLength");
    return {
      clusterPhysicalArea:
        clusterPixelArea * (referenceLength / referencePixelLength) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    clusterPixelArea: 10000,
    referencePixelLength: 100,
    referenceLength: 2,
  },
  output: { clusterPhysicalArea: 4 },
} satisfies ToolExample<Input, Output>;
export const amphibianEggclusterImageAreaScaleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/amphibian-eggcluster-image-area-scale",
    title: "Amphibian Eggcluster Image Area Scale Tool",
    description:
      "Scale supplied amphibian egg-cluster image area by an explicit same-plane linear calibration without estimating egg counts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clusterPixelArea: { type: "number", minimum: 0 },
        referencePixelLength: { type: "number", exclusiveMinimum: 0 },
        referenceLength: { type: "number", minimum: 0 },
      },
      required: ["clusterPixelArea", "referencePixelLength", "referenceLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { clusterPhysicalArea: { type: "number" } },
      required: ["clusterPhysicalArea"],
    },
    ports: {
      inputs: [
        {
          id: "clusterPixelArea",
          label: "Cluster Pixel Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePixelLength",
          label: "Reference Pixel Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLength",
          label: "Reference Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "clusterPhysicalArea",
          label: "Cluster Physical Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = amphibianEggclusterImageAreaScaleTool.execute;
export default amphibianEggclusterImageAreaScaleTool;
