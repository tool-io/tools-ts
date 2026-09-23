import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly orientations: readonly number[] };
export type Output = {
  readonly orientation: number;
  readonly reversalCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orientations: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["orientations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orientation: { type: "integer" },
    reversalCount: { type: "integer" },
  },
  required: ["orientation", "reversalCount"],
} as const;
/** Compose explicitly supplied orientation signs without changing the integral magnitude. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { orientations } = request;
  const compute = (): Output => {
    H.domain(orientations.every((x) => x === 1 || x === -1));
    return {
      orientation: orientations.reduce<number>((p, x) => p * x, 1),
      reversalCount: orientations.filter((x) => x === -1).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { orientations: [-1, -1, 1] },
  output: { orientation: 1, reversalCount: 2 },
} satisfies ToolExample<Input, Output>;
export const integralOrientationCompositionSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/integral-orientation-composition-sign",
    title: "Integral Orientation Composition Sign Tool",
    description:
      "Compose explicitly supplied orientation signs without changing the integral magnitude.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orientations: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["orientations"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orientation: { type: "integer" },
        reversalCount: { type: "integer" },
      },
      required: ["orientation", "reversalCount"],
    },
    ports: {
      inputs: [
        {
          id: "orientations",
          label: "Orientations",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "orientation",
          label: "Orientation",
          valueType: { type: "integer" },
        },
        {
          id: "reversalCount",
          label: "Reversal Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = integralOrientationCompositionSignTool.execute;
export default integralOrientationCompositionSignTool;
