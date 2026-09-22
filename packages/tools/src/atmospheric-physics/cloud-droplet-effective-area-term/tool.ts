import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radii: readonly number[];
  readonly numberWeights: readonly number[];
};
export type Output = {
  readonly projectedArea: number;
  readonly effectiveRadius: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radii: { type: "array", maxItems: 256, items: { type: "number" } },
    numberWeights: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["radii", "numberWeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projectedArea: { type: "number" },
    effectiveRadius: { type: "number" },
  },
  required: ["projectedArea", "effectiveRadius"],
} as const;
/** Number-weighted spherical projected area and the third/second radius moment ratio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radii, numberWeights } = request;
  const compute = (): Output => {
    H.sameLength(radii, numberWeights);
    H.domain(
      radii.every((x) => x >= 0) &&
        numberWeights.every((x) => x >= 0) &&
        radii.some((x, i) => x > 0 && numberWeights[i] > 0),
    );
    return {
      projectedArea:
        Math.PI * radii.reduce((s, r, i) => s + numberWeights[i] * r * r, 0),
      effectiveRadius:
        radii.reduce((s, r, i) => s + numberWeights[i] * r ** 3, 0) /
        radii.reduce((s, r, i) => s + numberWeights[i] * r * r, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radii: [1, 2], numberWeights: [2, 1] },
  output: {
    projectedArea: 18.84955592153876,
    effectiveRadius: 1.6666666666666667,
  },
} satisfies ToolExample<Input, Output>;
export const cloudDropletEffectiveAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/cloud-droplet-effective-area-term",
    title: "Cloud Droplet Effective Area Term Tool",
    description:
      "Number-weighted spherical projected area and the third/second radius moment ratio.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radii: { type: "array", maxItems: 256, items: { type: "number" } },
        numberWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["radii", "numberWeights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        projectedArea: { type: "number" },
        effectiveRadius: { type: "number" },
      },
      required: ["projectedArea", "effectiveRadius"],
    },
    ports: {
      inputs: [
        {
          id: "radii",
          label: "Radii",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "numberWeights",
          label: "Number Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "projectedArea",
          label: "Projected Area",
          valueType: { type: "number" },
        },
        {
          id: "effectiveRadius",
          label: "Effective Radius",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cloudDropletEffectiveAreaTermTool.execute;
export default cloudDropletEffectiveAreaTermTool;
