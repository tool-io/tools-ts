import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly present: number;
  readonly validProxies: number;
  readonly recused: number;
  readonly proxyRecusals: number;
  readonly countProxies: boolean;
};
export type Output = { readonly denominator: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    present: { type: "integer", minimum: 0 },
    validProxies: { type: "integer", minimum: 0 },
    recused: { type: "integer", minimum: 0 },
    proxyRecusals: { type: "integer", minimum: 0 },
    countProxies: { type: "boolean" },
  },
  required: [
    "present",
    "validProxies",
    "recused",
    "proxyRecusals",
    "countProxies",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { denominator: { type: "integer" } },
  required: ["denominator"],
} as const;
/** Explicit count of represented nonrecused seats without determining corporate voting rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { present, validProxies, recused, proxyRecusals, countProxies } =
    request;
  const compute = (): Output => {
    H.integer(present, 0);
    H.integer(validProxies, 0);
    H.integer(recused, 0, present);
    H.integer(proxyRecusals, 0, validProxies);
    return {
      denominator:
        present - recused + (countProxies ? validProxies - proxyRecusals : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    present: 8,
    validProxies: 3,
    recused: 1,
    proxyRecusals: 1,
    countProxies: true,
  },
  output: { denominator: 9 },
} satisfies ToolExample<Input, Output>;
export const boardProxyQuorumDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-administration/board-proxy-quorum-denominator",
    title: "Board Proxy Quorum Denominator Tool",
    description:
      "Explicit count of represented nonrecused seats without determining corporate voting rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        present: { type: "integer", minimum: 0 },
        validProxies: { type: "integer", minimum: 0 },
        recused: { type: "integer", minimum: 0 },
        proxyRecusals: { type: "integer", minimum: 0 },
        countProxies: { type: "boolean" },
      },
      required: [
        "present",
        "validProxies",
        "recused",
        "proxyRecusals",
        "countProxies",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { denominator: { type: "integer" } },
      required: ["denominator"],
    },
    ports: {
      inputs: [
        {
          id: "present",
          label: "Present",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "validProxies",
          label: "Valid Proxies",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recused",
          label: "Recused",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "proxyRecusals",
          label: "Proxy Recusals",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countProxies",
          label: "Count Proxies",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = boardProxyQuorumDenominatorTool.execute;
export default boardProxyQuorumDenominatorTool;
