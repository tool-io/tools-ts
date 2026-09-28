import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amount: number;
  readonly sourceIndex: number;
  readonly targetIndex: number;
  readonly sourceKnown: boolean;
  readonly targetKnown: boolean;
};
export type Output = {
  readonly defined: boolean;
  readonly rebasedAmount: number;
  readonly missingBases: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amount: { type: "number" },
    sourceIndex: { type: "number", exclusiveMinimum: 0 },
    targetIndex: { type: "number", exclusiveMinimum: 0 },
    sourceKnown: { type: "boolean" },
    targetKnown: { type: "boolean" },
  },
  required: [
    "amount",
    "sourceIndex",
    "targetIndex",
    "sourceKnown",
    "targetKnown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    defined: { type: "boolean" },
    rebasedAmount: { type: "number" },
    missingBases: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["defined", "rebasedAmount", "missingBases"],
} as const;
/** Retain missing-index metadata rather than silently substituting a price-year base. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amount, sourceIndex, targetIndex, sourceKnown, targetKnown } =
    request;
  const compute = (): Output => {
    H.positive(sourceIndex);
    H.positive(targetIndex);
    const defined = sourceKnown && targetKnown;
    return {
      defined,
      rebasedAmount: defined ? (amount * targetIndex) / sourceIndex : 0,
      missingBases: [
        ...(!sourceKnown ? ["source"] : []),
        ...(!targetKnown ? ["target"] : []),
      ],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    amount: 100,
    sourceIndex: 80,
    targetIndex: 120,
    sourceKnown: false,
    targetKnown: true,
  },
  output: { defined: false, rebasedAmount: 0, missingBases: ["source"] },
} satisfies ToolExample<Input, Output>;
export const inflationIndexMissingBaseGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/inflation-index-missing-base-gap",
    title: "Inflation Index Missing Base Gap Tool",
    description:
      "Retain missing-index metadata rather than silently substituting a price-year base.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amount: { type: "number" },
        sourceIndex: { type: "number", exclusiveMinimum: 0 },
        targetIndex: { type: "number", exclusiveMinimum: 0 },
        sourceKnown: { type: "boolean" },
        targetKnown: { type: "boolean" },
      },
      required: [
        "amount",
        "sourceIndex",
        "targetIndex",
        "sourceKnown",
        "targetKnown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        defined: { type: "boolean" },
        rebasedAmount: { type: "number" },
        missingBases: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["defined", "rebasedAmount", "missingBases"],
    },
    ports: {
      inputs: [
        {
          id: "amount",
          label: "Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceIndex",
          label: "Source Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetIndex",
          label: "Target Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceKnown",
          label: "Source Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "targetKnown",
          label: "Target Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        {
          id: "rebasedAmount",
          label: "Rebased Amount",
          valueType: { type: "number" },
        },
        {
          id: "missingBases",
          label: "Missing Bases",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = inflationIndexMissingBaseGapTool.execute;
export default inflationIndexMissingBaseGapTool;
