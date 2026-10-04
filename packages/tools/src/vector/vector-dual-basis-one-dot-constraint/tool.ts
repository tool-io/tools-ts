import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly basis: readonly number[];
  readonly dual: readonly number[];
  readonly sameIndex: boolean;
  readonly tolerance: number;
};
export type Output = {
  readonly dot: number;
  readonly residual: number;
  readonly satisfies: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    basis: { type: "array", maxItems: 256, items: { type: "number" } },
    dual: { type: "array", maxItems: 256, items: { type: "number" } },
    sameIndex: { type: "boolean" },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["basis", "dual", "sameIndex", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dot: { type: "number" },
    residual: { type: "number" },
    satisfies: { type: "boolean" },
  },
  required: ["dot", "residual", "satisfies"],
} as const;
/** Calculate vector dual basis one dot constraint from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { basis, dual, sameIndex, tolerance } = request;
  const compute = (): Output => {
    H.sameLength(basis, dual);
    H.domain(tolerance >= 0);
    const dot = H.dot(basis, dual),
      residual = dot - (sameIndex ? 1 : 0);
    return { dot, residual, satisfies: Math.abs(residual) <= tolerance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { basis: [2, 0], dual: [0.5, 0], sameIndex: true, tolerance: 0 },
  output: { dot: 1, residual: 0, satisfies: true },
} satisfies ToolExample<Input, Output>;
export const vectorDualBasisOneDotConstraintTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-dual-basis-one-dot-constraint",
    title: "Vector Dual Basis One Dot Constraint Tool",
    description:
      "Calculate vector dual basis one dot constraint from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        basis: { type: "array", maxItems: 256, items: { type: "number" } },
        dual: { type: "array", maxItems: 256, items: { type: "number" } },
        sameIndex: { type: "boolean" },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["basis", "dual", "sameIndex", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dot: { type: "number" },
        residual: { type: "number" },
        satisfies: { type: "boolean" },
      },
      required: ["dot", "residual", "satisfies"],
    },
    ports: {
      inputs: [
        {
          id: "basis",
          label: "Basis",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "dual",
          label: "Dual",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sameIndex",
          label: "Same Index",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dot", label: "Dot", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
        { id: "satisfies", label: "Satisfies", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = vectorDualBasisOneDotConstraintTool.execute;
export default vectorDualBasisOneDotConstraintTool;
