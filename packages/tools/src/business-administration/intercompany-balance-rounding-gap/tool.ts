import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstBalance: number;
  readonly secondBalance: number;
  readonly firstToBase: number;
  readonly secondToBase: number;
  readonly suppliedTolerance: number;
};
export type Output = {
  readonly residual: number;
  readonly withinTolerance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstBalance: { type: "number" },
    secondBalance: { type: "number" },
    firstToBase: { type: "number", exclusiveMinimum: 0 },
    secondToBase: { type: "number", exclusiveMinimum: 0 },
    suppliedTolerance: { type: "number", minimum: 0 },
  },
  required: [
    "firstBalance",
    "secondBalance",
    "firstToBase",
    "secondToBase",
    "suppliedTolerance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residual: { type: "number" },
    withinTolerance: { type: "boolean" },
  },
  required: ["residual", "withinTolerance"],
} as const;
/** Calculate intercompany balance rounding gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstBalance,
    secondBalance,
    firstToBase,
    secondToBase,
    suppliedTolerance,
  } = request;
  const compute = (): Output => {
    H.positive(firstToBase);
    H.positive(secondToBase);
    H.domain(suppliedTolerance >= 0);
    return {
      residual: firstBalance * firstToBase + secondBalance * secondToBase,
      withinTolerance:
        Math.abs(firstBalance * firstToBase + secondBalance * secondToBase) <=
        suppliedTolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstBalance: 100,
    secondBalance: -50,
    firstToBase: 1,
    secondToBase: 2,
    suppliedTolerance: 0,
  },
  output: { residual: 0, withinTolerance: true },
} satisfies ToolExample<Input, Output>;
export const intercompanyBalanceRoundingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-administration/intercompany-balance-rounding-gap",
    title: "Intercompany Balance Rounding Gap Tool",
    description:
      "Calculate intercompany balance rounding gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstBalance: { type: "number" },
        secondBalance: { type: "number" },
        firstToBase: { type: "number", exclusiveMinimum: 0 },
        secondToBase: { type: "number", exclusiveMinimum: 0 },
        suppliedTolerance: { type: "number", minimum: 0 },
      },
      required: [
        "firstBalance",
        "secondBalance",
        "firstToBase",
        "secondToBase",
        "suppliedTolerance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        residual: { type: "number" },
        withinTolerance: { type: "boolean" },
      },
      required: ["residual", "withinTolerance"],
    },
    ports: {
      inputs: [
        {
          id: "firstBalance",
          label: "First Balance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondBalance",
          label: "Second Balance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstToBase",
          label: "First To Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondToBase",
          label: "Second To Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTolerance",
          label: "Supplied Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "residual", label: "Residual", valueType: { type: "number" } },
        {
          id: "withinTolerance",
          label: "Within Tolerance",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = intercompanyBalanceRoundingGapTool.execute;
export default intercompanyBalanceRoundingGapTool;
