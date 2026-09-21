import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleArea: number;
  readonly suppliedCap: number;
};
export type Output = { readonly gap: number; readonly cappedArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleArea: { type: "number", minimum: 0 },
    suppliedCap: { type: "number", minimum: 0 },
  },
  required: ["eligibleArea", "suppliedCap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, cappedArea: { type: "number" } },
  required: ["gap", "cappedArea"],
} as const;
/** Apply an explicitly supplied eligible-area cap without inferring a policy or claim entitlement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleArea, suppliedCap } = request;
  const compute = (): Output => {
    H.domain(eligibleArea >= 0 && suppliedCap >= 0);
    return {
      gap: suppliedCap - eligibleArea,
      cappedArea: Math.min(eligibleArea, suppliedCap),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eligibleArea: 120, suppliedCap: 100 },
  output: { gap: -20, cappedArea: 100 },
} satisfies ToolExample<Input, Output>;
export const eligibleHectareCapGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-policy/eligible-hectare-cap-gap",
    title: "Eligible Hectare Cap Gap Tool",
    description:
      "Apply an explicitly supplied eligible-area cap without inferring a policy or claim entitlement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleArea: { type: "number", minimum: 0 },
        suppliedCap: { type: "number", minimum: 0 },
      },
      required: ["eligibleArea", "suppliedCap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" }, cappedArea: { type: "number" } },
      required: ["gap", "cappedArea"],
    },
    ports: {
      inputs: [
        {
          id: "eligibleArea",
          label: "Eligible Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCap",
          label: "Supplied Cap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        {
          id: "cappedArea",
          label: "Capped Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = eligibleHectareCapGapTool.execute;
export default eligibleHectareCapGapTool;
