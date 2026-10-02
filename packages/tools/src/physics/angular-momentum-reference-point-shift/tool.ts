import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly momentum: readonly number[];
  readonly displacement: readonly number[];
  readonly angularMomentum: readonly number[];
};
export type Output = { readonly angularMomentum: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    momentum: { type: "array", maxItems: 256, items: { type: "number" } },
    displacement: { type: "array", maxItems: 256, items: { type: "number" } },
    angularMomentum: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["momentum", "displacement", "angularMomentum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angularMomentum: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["angularMomentum"],
} as const;
/** Shift angular momentum to an origin displaced by the supplied vector using L_new=L_old-displacement cross momentum. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { momentum, displacement, angularMomentum } = input;
  const compute = (): Output => {
    H.domain(
      momentum.length === 3 &&
        displacement.length === 3 &&
        angularMomentum.length === 3,
    );
    const [a, b, c] = displacement,
      [p, q, r] = momentum;
    return {
      angularMomentum: [
        angularMomentum[0] - (b * r - c * q),
        angularMomentum[1] - (c * p - a * r),
        angularMomentum[2] - (a * q - b * p),
      ],
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    momentum: [0, 2, 0],
    displacement: [1, 0, 0],
    angularMomentum: [0, 0, 5],
  },
  output: { angularMomentum: [0, 0, 3] },
} satisfies ToolExample<Input, Output>;
export const angularMomentumReferencePointShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/angular-momentum-reference-point-shift",
    title: "Angular Momentum Reference Point Shift Tool",
    description:
      "Shift angular momentum to an origin displaced by the supplied vector using L_new=L_old-displacement cross momentum.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        momentum: { type: "array", maxItems: 256, items: { type: "number" } },
        displacement: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        angularMomentum: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["momentum", "displacement", "angularMomentum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angularMomentum: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["angularMomentum"],
    },
    ports: {
      inputs: [
        {
          id: "momentum",
          label: "Momentum",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "displacement",
          label: "Displacement",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "angularMomentum",
          label: "Angular Momentum",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "angularMomentum",
          label: "Angular Momentum",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = angularMomentumReferencePointShiftTool.execute;
export default angularMomentumReferencePointShiftTool;
