import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initial: number;
  readonly residualLower: number;
  readonly residualUpper: number;
};
export type Output = {
  readonly removalLower: number;
  readonly removalUpper: number;
  readonly width: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initial: { type: "number", minimum: 0 },
    residualLower: { type: "number", minimum: 0 },
    residualUpper: { type: "number" },
  },
  required: ["initial", "residualLower", "residualUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    removalLower: { type: "number" },
    removalUpper: { type: "number" },
    width: { type: "number" },
  },
  required: ["removalLower", "removalUpper", "width"],
} as const;
/** Propagate a supplied residual-amount interval through initial-minus-residual, retaining possible negative removal. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initial, residualLower, residualUpper } = request;
  const compute = (): Output => {
    H.domain(
      initial >= 0 && residualLower >= 0 && residualUpper >= residualLower,
    );
    return {
      removalLower: initial - residualUpper,
      removalUpper: initial - residualLower,
      width: residualUpper - residualLower,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initial: 10, residualLower: 2, residualUpper: 4 },
  output: { removalLower: 6, removalUpper: 8, width: 2 },
} satisfies ToolExample<Input, Output>;
export const censoredRemovalBoundWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioremediation/censored-removal-bound-width",
    title: "Censored Removal Bound Width Tool",
    description:
      "Propagate a supplied residual-amount interval through initial-minus-residual, retaining possible negative removal.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initial: { type: "number", minimum: 0 },
        residualLower: { type: "number", minimum: 0 },
        residualUpper: { type: "number" },
      },
      required: ["initial", "residualLower", "residualUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        removalLower: { type: "number" },
        removalUpper: { type: "number" },
        width: { type: "number" },
      },
      required: ["removalLower", "removalUpper", "width"],
    },
    ports: {
      inputs: [
        {
          id: "initial",
          label: "Initial",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "residualLower",
          label: "Residual Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "residualUpper",
          label: "Residual Upper",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "removalLower",
          label: "Removal Lower",
          valueType: { type: "number" },
        },
        {
          id: "removalUpper",
          label: "Removal Upper",
          valueType: { type: "number" },
        },
        { id: "width", label: "Width", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = censoredRemovalBoundWidthTool.execute;
export default censoredRemovalBoundWidthTool;
