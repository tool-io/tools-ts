import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly directMinutes: number;
  readonly proxyMinutes: number;
  readonly sharedMinutes: number;
  readonly countProxy: boolean;
};
export type Output = { readonly creditedMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    directMinutes: { type: "number", minimum: 0 },
    proxyMinutes: { type: "number", minimum: 0 },
    sharedMinutes: { type: "number", minimum: 0 },
    countProxy: { type: "boolean" },
  },
  required: ["directMinutes", "proxyMinutes", "sharedMinutes", "countProxy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { creditedMinutes: { type: "number" } },
  required: ["creditedMinutes"],
} as const;
/** Deduplicate supplied direct/proxy contact minutes without assessing proxy authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { directMinutes, proxyMinutes, sharedMinutes, countProxy } = request;
  const compute = (): Output => {
    H.domain(
      directMinutes >= 0 &&
        proxyMinutes >= 0 &&
        sharedMinutes >= 0 &&
        sharedMinutes <= Math.min(directMinutes, proxyMinutes),
    );
    return {
      creditedMinutes:
        directMinutes + (countProxy ? proxyMinutes - sharedMinutes : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    directMinutes: 30,
    proxyMinutes: 20,
    sharedMinutes: 10,
    countProxy: true,
  },
  output: { creditedMinutes: 40 },
} satisfies ToolExample<Input, Output>;
export const olderAdultProxyWindowCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/older-adult-proxy-window-credit",
    title: "Older Adult Proxy Window Credit Tool",
    description:
      "Deduplicate supplied direct/proxy contact minutes without assessing proxy authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        directMinutes: { type: "number", minimum: 0 },
        proxyMinutes: { type: "number", minimum: 0 },
        sharedMinutes: { type: "number", minimum: 0 },
        countProxy: { type: "boolean" },
      },
      required: [
        "directMinutes",
        "proxyMinutes",
        "sharedMinutes",
        "countProxy",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { creditedMinutes: { type: "number" } },
      required: ["creditedMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "directMinutes",
          label: "Direct Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "proxyMinutes",
          label: "Proxy Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedMinutes",
          label: "Shared Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "countProxy",
          label: "Count Proxy",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "creditedMinutes",
          label: "Credited Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = olderAdultProxyWindowCreditTool.execute;
export default olderAdultProxyWindowCreditTool;
