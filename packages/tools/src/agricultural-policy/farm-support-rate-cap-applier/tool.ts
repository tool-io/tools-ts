import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedRate: number;
  readonly suppliedCap: number;
};
export type Output = {
  readonly cappedRate: number;
  readonly reduction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedRate: { type: "number", minimum: 0 },
    suppliedCap: { type: "number", minimum: 0 },
  },
  required: ["suppliedRate", "suppliedCap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cappedRate: { type: "number" }, reduction: { type: "number" } },
  required: ["cappedRate", "reduction"],
} as const;
/** Apply an explicit upper cap to a supplied support rate without looking up policy amounts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedRate, suppliedCap } = request;
  const compute = (): Output => {
    H.domain(suppliedRate >= 0 && suppliedCap >= 0, "suppliedRate");
    return {
      cappedRate: Math.min(suppliedRate, suppliedCap),
      reduction: Math.max(0, suppliedRate - suppliedCap),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedRate: 120, suppliedCap: 100 },
  output: { cappedRate: 100, reduction: 20 },
} satisfies ToolExample<Input, Output>;
export const farmSupportRateCapApplierTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agricultural-policy", "agricultural policy", "agriculture"],
      keywords: ["agricultural policy", "agriculture"],
    },
    id: "agricultural-policy/farm-support-rate-cap-applier",
    title: "Farm Support Rate Cap Applier",
    description:
      "Apply an explicit upper cap to a supplied support rate without looking up policy amounts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedRate: { type: "number", minimum: 0 },
        suppliedCap: { type: "number", minimum: 0 },
      },
      required: ["suppliedRate", "suppliedCap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cappedRate: { type: "number" },
        reduction: { type: "number" },
      },
      required: ["cappedRate", "reduction"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedRate",
          label: "Supplied Rate",
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
        {
          id: "cappedRate",
          label: "Capped Rate",
          valueType: { type: "number" },
        },
        { id: "reduction", label: "Reduction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmSupportRateCapApplierTool.execute;
export default farmSupportRateCapApplierTool;
