import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speeds: readonly number[];
  readonly spacings: readonly number[];
  readonly timeStep: number;
  readonly suppliedLimit: number;
};
export type Output = { readonly courantSum: number; readonly margin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speeds: { type: "array", maxItems: 256, items: { type: "number" } },
    spacings: { type: "array", maxItems: 256, items: { type: "number" } },
    timeStep: { type: "number", minimum: 0 },
    suppliedLimit: { type: "number", minimum: 0 },
  },
  required: ["speeds", "spacings", "timeStep", "suppliedLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { courantSum: { type: "number" }, margin: { type: "number" } },
  required: ["courantSum", "margin"],
} as const;
/** Sum-of-direction Courant budget with a supplied scheme limit, not a universal stability guarantee. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speeds, spacings, timeStep, suppliedLimit } = request;
  const compute = (): Output => {
    H.sameLength(speeds, spacings);
    H.domain(
      spacings.length > 0 &&
        spacings.every((x) => x > 0) &&
        timeStep >= 0 &&
        suppliedLimit >= 0,
    );
    return {
      courantSum:
        timeStep * speeds.reduce((s, x, i) => s + Math.abs(x) / spacings[i], 0),
      margin:
        suppliedLimit -
        timeStep * speeds.reduce((s, x, i) => s + Math.abs(x) / spacings[i], 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { speeds: [1, 2], spacings: [2, 4], timeStep: 0.5, suppliedLimit: 1 },
  output: { courantSum: 0.5, margin: 0.5 },
} satisfies ToolExample<Input, Output>;
export const cflDiagonalGridStepBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/cfl-diagonal-grid-step-budget",
    title: "CFL Diagonal Grid Step Budget Tool",
    description:
      "Sum-of-direction Courant budget with a supplied scheme limit, not a universal stability guarantee.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speeds: { type: "array", maxItems: 256, items: { type: "number" } },
        spacings: { type: "array", maxItems: 256, items: { type: "number" } },
        timeStep: { type: "number", minimum: 0 },
        suppliedLimit: { type: "number", minimum: 0 },
      },
      required: ["speeds", "spacings", "timeStep", "suppliedLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        courantSum: { type: "number" },
        margin: { type: "number" },
      },
      required: ["courantSum", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "speeds",
          label: "Speeds",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "spacings",
          label: "Spacings",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "timeStep",
          label: "Time Step",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLimit",
          label: "Supplied Limit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "courantSum",
          label: "Courant Sum",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cflDiagonalGridStepBudgetTool.execute;
export default cflDiagonalGridStepBudgetTool;
