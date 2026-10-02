import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numerators: readonly number[];
  readonly denominators: readonly number[];
};
export type Output = {
  readonly undefinedMask: readonly boolean[];
  readonly zeroOverZeroMask: readonly boolean[];
  readonly feasible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerators: { type: "array", maxItems: 256, items: { type: "number" } },
    denominators: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["numerators", "denominators"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    undefinedMask: { type: "array", maxItems: 256, items: { type: "boolean" } },
    zeroOverZeroMask: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    feasible: { type: "boolean" },
  },
  required: ["undefinedMask", "zeroOverZeroMask", "feasible"],
} as const;
/** Calculate ratio feasibility zero mask from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numerators, denominators } = request;
  const compute = (): Output => {
    H.sameLength(numerators, denominators);
    return {
      undefinedMask: denominators.map((x) => x === 0),
      zeroOverZeroMask: denominators.map(
        (x, i) => x === 0 && numerators[i] === 0,
      ),
      feasible: denominators.every((x) => x !== 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { numerators: [0, 2, 3], denominators: [0, 0, 1] },
  output: {
    undefinedMask: [true, true, false],
    zeroOverZeroMask: [true, false, false],
    feasible: false,
  },
} satisfies ToolExample<Input, Output>;
export const ratioFeasibilityZeroMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/ratio-feasibility-zero-mask",
    title: "Ratio Feasibility Zero Mask Tool",
    description:
      "Calculate ratio feasibility zero mask from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numerators: { type: "array", maxItems: 256, items: { type: "number" } },
        denominators: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["numerators", "denominators"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        undefinedMask: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        zeroOverZeroMask: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        feasible: { type: "boolean" },
      },
      required: ["undefinedMask", "zeroOverZeroMask", "feasible"],
    },
    ports: {
      inputs: [
        {
          id: "numerators",
          label: "Numerators",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "denominators",
          label: "Denominators",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "undefinedMask",
          label: "Undefined Mask",
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "zeroOverZeroMask",
          label: "Zero Over Zero Mask",
          valueType: { type: "list", items: { type: "boolean" } },
        },
        { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = ratioFeasibilityZeroMaskTool.execute;
export default ratioFeasibilityZeroMaskTool;
