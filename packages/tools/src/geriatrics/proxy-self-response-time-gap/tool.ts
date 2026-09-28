import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly proxyAt: number; readonly selfAt: number };
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { proxyAt: { type: "number" }, selfAt: { type: "number" } },
  required: ["proxyAt", "selfAt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Compare supplied research response clocks without assessing respondent reliability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { proxyAt, selfAt } = request;
  const compute = (): Output => {
    return { gap: proxyAt - selfAt };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { proxyAt: 20, selfAt: 15 },
  output: { gap: 5 },
} satisfies ToolExample<Input, Output>;
export const proxySelfResponseTimeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/proxy-self-response-time-gap",
    title: "Proxy Self Response Time Gap Tool",
    description:
      "Compare supplied research response clocks without assessing respondent reliability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { proxyAt: { type: "number" }, selfAt: { type: "number" } },
      required: ["proxyAt", "selfAt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "proxyAt",
          label: "Proxy At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "selfAt",
          label: "Self At",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = proxySelfResponseTimeGapTool.execute;
export default proxySelfResponseTimeGapTool;
