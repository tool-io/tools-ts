import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fromFamily: string;
  readonly toFamily: string;
  readonly fromKeys: readonly string[];
  readonly toKeys: readonly string[];
  readonly suppliedCosts: readonly number[];
  readonly defaultCost: number;
};
export type Output = { readonly found: boolean; readonly cost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fromFamily: { type: "string", maxLength: 8192 },
    toFamily: { type: "string", maxLength: 8192 },
    fromKeys: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    toKeys: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedCosts: { type: "array", maxItems: 256, items: { type: "number" } },
    defaultCost: { type: "number" },
  },
  required: [
    "fromFamily",
    "toFamily",
    "fromKeys",
    "toKeys",
    "suppliedCosts",
    "defaultCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { found: { type: "boolean" }, cost: { type: "number" } },
  required: ["found", "cost"],
} as const;
/** Resolve one directed changeover cost from an explicit caller-supplied edge table. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fromFamily, toFamily, fromKeys, toKeys, suppliedCosts, defaultCost } =
    request;
  const compute = (): Output => {
    H.sameLength(fromKeys, toKeys);
    H.sameLength(fromKeys, suppliedCosts);
    H.domain(
      new Set(fromKeys.map((x, i) => JSON.stringify([x, toKeys[i]]))).size ===
        fromKeys.length,
    );
    const i = fromKeys.findIndex(
      (x, i) => x === fromFamily && toKeys[i] === toFamily,
    );
    return { found: i >= 0, cost: i >= 0 ? suppliedCosts[i] : defaultCost };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fromFamily: "A",
    toFamily: "B",
    fromKeys: ["A", "B"],
    toKeys: ["B", "A"],
    suppliedCosts: [10, 20],
    defaultCost: 5,
  },
  output: { found: true, cost: 10 },
} satisfies ToolExample<Input, Output>;
export const changeoverSequenceCostEdgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/changeover-sequence-cost-edge",
    title: "Changeover Sequence Cost Edge Tool",
    description:
      "Resolve one directed changeover cost from an explicit caller-supplied edge table.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fromFamily: { type: "string", maxLength: 8192 },
        toFamily: { type: "string", maxLength: 8192 },
        fromKeys: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        toKeys: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedCosts: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        defaultCost: { type: "number" },
      },
      required: [
        "fromFamily",
        "toFamily",
        "fromKeys",
        "toKeys",
        "suppliedCosts",
        "defaultCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { found: { type: "boolean" }, cost: { type: "number" } },
      required: ["found", "cost"],
    },
    ports: {
      inputs: [
        {
          id: "fromFamily",
          label: "From Family",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "toFamily",
          label: "To Family",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fromKeys",
          label: "From Keys",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "toKeys",
          label: "To Keys",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedCosts",
          label: "Supplied Costs",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "defaultCost",
          label: "Default Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "found", label: "Found", valueType: { type: "boolean" } },
        { id: "cost", label: "Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = changeoverSequenceCostEdgeTool.execute;
export default changeoverSequenceCostEdgeTool;
