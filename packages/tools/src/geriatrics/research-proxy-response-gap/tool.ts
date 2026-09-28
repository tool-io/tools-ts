import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemIds: readonly string[];
  readonly selfResponses: readonly number[];
  readonly proxyResponses: readonly number[];
  readonly pairedValid: readonly boolean[];
};
export type Output = {
  readonly validPairs: number;
  readonly meanProxyMinusSelf: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    selfResponses: { type: "array", maxItems: 256, items: { type: "number" } },
    proxyResponses: { type: "array", maxItems: 256, items: { type: "number" } },
    pairedValid: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["itemIds", "selfResponses", "proxyResponses", "pairedValid"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validPairs: { type: "integer" },
    meanProxyMinusSelf: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["validPairs", "meanProxyMinusSelf", "defined"],
} as const;
/** Compare explicit paired research responses without an instrument score or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemIds, selfResponses, proxyResponses, pairedValid } = request;
  const compute = (): Output => {
    H.sameLength(itemIds, selfResponses);
    H.sameLength(itemIds, proxyResponses);
    H.sameLength(itemIds, pairedValid);
    H.domain(new Set(itemIds).size === itemIds.length);
    return (() => {
      const validPairs = pairedValid.filter(Boolean).length,
        sum = selfResponses.reduce(
          (s, x, i) => s + (pairedValid[i] ? proxyResponses[i] - x : 0),
          0,
        );
      return {
        validPairs,
        meanProxyMinusSelf: validPairs > 0 ? sum / validPairs : 0,
        defined: validPairs > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    itemIds: ["a", "b"],
    selfResponses: [2, 3],
    proxyResponses: [3, 5],
    pairedValid: [true, false],
  },
  output: { validPairs: 1, meanProxyMinusSelf: 1, defined: true },
} satisfies ToolExample<Input, Output>;
export const researchProxyResponseGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/research-proxy-response-gap",
    title: "Research Proxy Response Gap Tool",
    description:
      "Compare explicit paired research responses without an instrument score or clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        selfResponses: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        proxyResponses: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        pairedValid: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["itemIds", "selfResponses", "proxyResponses", "pairedValid"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validPairs: { type: "integer" },
        meanProxyMinusSelf: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["validPairs", "meanProxyMinusSelf", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "itemIds",
          label: "Item Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "selfResponses",
          label: "Self Responses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "proxyResponses",
          label: "Proxy Responses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "pairedValid",
          label: "Paired Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "validPairs",
          label: "Valid Pairs",
          valueType: { type: "integer" },
        },
        {
          id: "meanProxyMinusSelf",
          label: "Mean Proxy Minus Self",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = researchProxyResponseGapTool.execute;
export default researchProxyResponseGapTool;
