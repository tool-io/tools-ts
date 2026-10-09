import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly inDegree: number; readonly outDegree: number };
export type Output = {
  readonly outMinusIn: number;
  readonly balanced: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inDegree: { type: "integer", minimum: 0 },
    outDegree: { type: "integer", minimum: 0 },
  },
  required: ["inDegree", "outDegree"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outMinusIn: { type: "integer" },
    balanced: { type: "boolean" },
  },
  required: ["outMinusIn", "balanced"],
} as const;
/** Subtract explicit in-degree from out-degree and report local balance without asserting Eulerian connectivity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inDegree, outDegree } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(inDegree) &&
        inDegree >= 0 &&
        inDegree <= Number.MAX_SAFE_INTEGER,
      "inDegree",
    ),
      inDegree);
    (H.domain(
      Number.isSafeInteger(outDegree) &&
        outDegree >= 0 &&
        outDegree <= Number.MAX_SAFE_INTEGER,
      "outDegree",
    ),
      outDegree);
    return {
      outMinusIn: outDegree - inDegree,
      balanced: outDegree === inDegree,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inDegree: 3, outDegree: 5 },
  output: { outMinusIn: 2, balanced: false },
} satisfies ToolExample<Input, Output>;
export const digraphInOutDegreeImbalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["graph", "mathematics"],
      keywords: ["graph", "mathematics"],
    },
    id: "graph/digraph-in-out-degree-imbalance",
    title: "Digraph In Out Degree Imbalance",
    description:
      "Subtract explicit in-degree from out-degree and report local balance without asserting Eulerian connectivity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inDegree: { type: "integer", minimum: 0 },
        outDegree: { type: "integer", minimum: 0 },
      },
      required: ["inDegree", "outDegree"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outMinusIn: { type: "integer" },
        balanced: { type: "boolean" },
      },
      required: ["outMinusIn", "balanced"],
    },
    ports: {
      inputs: [
        {
          id: "inDegree",
          label: "In Degree",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "outDegree",
          label: "Out Degree",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "outMinusIn",
          label: "Out Minus In",
          valueType: { type: "integer" },
        },
        { id: "balanced", label: "Balanced", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = digraphInOutDegreeImbalanceTool.execute;
export default digraphInOutDegreeImbalanceTool;
