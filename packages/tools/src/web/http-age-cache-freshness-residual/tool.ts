import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly freshnessLifetime: number;
  readonly currentAge: number;
};
export type Output = { readonly remaining: number; readonly fresh: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    freshnessLifetime: { type: "number", minimum: 0 },
    currentAge: { type: "number", minimum: 0 },
  },
  required: ["freshnessLifetime", "currentAge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remaining: { type: "number" }, fresh: { type: "boolean" } },
  required: ["remaining", "fresh"],
} as const;
/** Calculate http age cache freshness residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { freshnessLifetime, currentAge } = request;
  const compute = (): Output => {
    H.domain(freshnessLifetime >= 0 && currentAge >= 0);
    const remaining = freshnessLifetime - currentAge;
    return { remaining, fresh: remaining > 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { freshnessLifetime: 60, currentAge: 45 },
  output: { remaining: 15, fresh: true },
} satisfies ToolExample<Input, Output>;
export const httpAgeCacheFreshnessResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/http-age-cache-freshness-residual",
    title: "HTTP Age Cache Freshness Residual Tool",
    description:
      "Calculate http age cache freshness residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        freshnessLifetime: { type: "number", minimum: 0 },
        currentAge: { type: "number", minimum: 0 },
      },
      required: ["freshnessLifetime", "currentAge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remaining: { type: "number" }, fresh: { type: "boolean" } },
      required: ["remaining", "fresh"],
    },
    ports: {
      inputs: [
        {
          id: "freshnessLifetime",
          label: "Freshness Lifetime",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentAge",
          label: "Current Age",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        { id: "fresh", label: "Fresh", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = httpAgeCacheFreshnessResidualTool.execute;
export default httpAgeCacheFreshnessResidualTool;
