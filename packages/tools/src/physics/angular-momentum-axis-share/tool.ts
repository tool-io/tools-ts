import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { calculate as normalizedDot } from "../../vector/vector-normalized-dot-residual/tool.js";
export type Input = {
  readonly angularMomentum: readonly number[];
  readonly axis: readonly number[];
};
export type Output = {
  readonly projection: number;
  readonly magnitude: number;
  readonly signedShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angularMomentum: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    axis: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["angularMomentum", "axis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projection: { type: "number" },
    magnitude: { type: "number" },
    signedShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["projection", "magnitude", "signedShare", "defined"],
} as const;
/** Project a supplied three-component angular momentum onto a declared axis; a zero momentum has no directional share. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angularMomentum, axis } = request;
  const compute = (): Output => {
    H.domain(angularMomentum.length === 3 && axis.length === 3);
    H.domain(
      axis.some((x) => x !== 0),
      "axis",
      "Provide a nonzero axis.",
    );
    const magnitude = Math.hypot(...angularMomentum);
    if (magnitude === 0)
      return { projection: 0, magnitude: 0, signedShare: 0, defined: false };
    const signedShare = normalizedDot({
      first: angularMomentum,
      second: axis,
      suppliedCosine: 0,
    }).cosine;
    return {
      projection: magnitude * signedShare,
      magnitude,
      signedShare,
      defined: true,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angularMomentum: [3, 4, 0], axis: [1, 0, 0] },
  output: { projection: 3, magnitude: 5, signedShare: 0.6, defined: true },
} satisfies ToolExample<Input, Output>;
export const angularMomentumAxisShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/angular-momentum-axis-share",
    title: "Angular Momentum Axis Share Tool",
    description:
      "Project a supplied three-component angular momentum onto a declared axis; a zero momentum has no directional share.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angularMomentum: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        axis: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["angularMomentum", "axis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        projection: { type: "number" },
        magnitude: { type: "number" },
        signedShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["projection", "magnitude", "signedShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "angularMomentum",
          label: "Angular Momentum",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "axis",
          label: "Axis",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "projection",
          label: "Projection",
          valueType: { type: "number" },
        },
        { id: "magnitude", label: "Magnitude", valueType: { type: "number" } },
        {
          id: "signedShare",
          label: "Signed Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = angularMomentumAxisShareTool.execute;
export default angularMomentumAxisShareTool;
