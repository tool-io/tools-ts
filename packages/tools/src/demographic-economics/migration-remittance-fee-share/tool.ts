import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossRemittance: number;
  readonly fixedFee: number;
  readonly variableFeeFraction: number;
};
export type Output = {
  readonly totalFee: number;
  readonly netRemittance: number;
  readonly feeShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossRemittance: { type: "number", exclusiveMinimum: 0 },
    fixedFee: { type: "number", minimum: 0 },
    variableFeeFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["grossRemittance", "fixedFee", "variableFeeFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalFee: { type: "number" },
    netRemittance: { type: "number" },
    feeShare: { type: "number" },
  },
  required: ["totalFee", "netRemittance", "feeShare"],
} as const;
/** Describe a recorded remittance after explicit fixed and proportional fees in one currency without exchange-rate assumptions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossRemittance, fixedFee, variableFeeFraction } = request;
  const compute = (): Output => {
    (H.domain(grossRemittance > 0, "grossRemittance"), grossRemittance);
    H.domain(fixedFee >= 0, "fixedFee");
    (H.domain(
      variableFeeFraction >= 0 && variableFeeFraction <= 1,
      "variableFeeFraction",
    ),
      variableFeeFraction);
    return (() => {
      const totalFee = fixedFee + grossRemittance * variableFeeFraction;
      H.domain(totalFee <= grossRemittance, "grossRemittance");
      return {
        totalFee,
        netRemittance: grossRemittance - totalFee,
        feeShare: totalFee / grossRemittance,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossRemittance: 200, fixedFee: 5, variableFeeFraction: 0.025 },
  output: { totalFee: 10, netRemittance: 190, feeShare: 0.05 },
} satisfies ToolExample<Input, Output>;
export const migrationRemittanceFeeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["demographic-economics", "demographic economics", "economics"],
      keywords: ["demographic economics", "economics"],
    },
    id: "demographic-economics/migration-remittance-fee-share",
    title: "Migration Remittance Fee Share",
    description:
      "Describe a recorded remittance after explicit fixed and proportional fees in one currency without exchange-rate assumptions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossRemittance: { type: "number", exclusiveMinimum: 0 },
        fixedFee: { type: "number", minimum: 0 },
        variableFeeFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["grossRemittance", "fixedFee", "variableFeeFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalFee: { type: "number" },
        netRemittance: { type: "number" },
        feeShare: { type: "number" },
      },
      required: ["totalFee", "netRemittance", "feeShare"],
    },
    ports: {
      inputs: [
        {
          id: "grossRemittance",
          label: "Gross Remittance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedFee",
          label: "Fixed Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "variableFeeFraction",
          label: "Variable Fee Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "totalFee", label: "Total Fee", valueType: { type: "number" } },
        {
          id: "netRemittance",
          label: "Net Remittance",
          valueType: { type: "number" },
        },
        { id: "feeShare", label: "Fee Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = migrationRemittanceFeeShareTool.execute;
export default migrationRemittanceFeeShareTool;
