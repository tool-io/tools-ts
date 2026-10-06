import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly marketReturnPerHectare: number;
  readonly subsidyPerHectare: number;
  readonly complianceCostPerHectare: number;
};
export type Output = {
  readonly netReturnPerHectare: number;
  readonly subsidyNetContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marketReturnPerHectare: { type: "number" },
    subsidyPerHectare: { type: "number", minimum: 0 },
    complianceCostPerHectare: { type: "number", minimum: 0 },
  },
  required: [
    "marketReturnPerHectare",
    "subsidyPerHectare",
    "complianceCostPerHectare",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netReturnPerHectare: { type: "number" },
    subsidyNetContribution: { type: "number" },
  },
  required: ["netReturnPerHectare", "subsidyNetContribution"],
} as const;
/** Add an explicitly supplied subsidy and deduct its nonoverlapping compliance cost from a signed market return per hectare. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    marketReturnPerHectare,
    subsidyPerHectare,
    complianceCostPerHectare,
  } = request;
  const compute = (): Output => {
    H.domain(
      subsidyPerHectare >= 0 && complianceCostPerHectare >= 0,
      "subsidyPerHectare",
    );
    return {
      netReturnPerHectare:
        marketReturnPerHectare + subsidyPerHectare - complianceCostPerHectare,
      subsidyNetContribution: subsidyPerHectare - complianceCostPerHectare,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    marketReturnPerHectare: 500,
    subsidyPerHectare: 100,
    complianceCostPerHectare: 30,
  },
  output: { netReturnPerHectare: 570, subsidyNetContribution: 70 },
} satisfies ToolExample<Input, Output>;
export const subsidyPerHectareNetReturnTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "agricultural-economics",
        "agricultural economics",
        "agriculture",
      ],
      keywords: ["agricultural economics", "agriculture"],
    },
    id: "agricultural-economics/subsidy-per-hectare-net-return",
    title: "Subsidy Per Hectare Net Return",
    description:
      "Add an explicitly supplied subsidy and deduct its nonoverlapping compliance cost from a signed market return per hectare.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marketReturnPerHectare: { type: "number" },
        subsidyPerHectare: { type: "number", minimum: 0 },
        complianceCostPerHectare: { type: "number", minimum: 0 },
      },
      required: [
        "marketReturnPerHectare",
        "subsidyPerHectare",
        "complianceCostPerHectare",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netReturnPerHectare: { type: "number" },
        subsidyNetContribution: { type: "number" },
      },
      required: ["netReturnPerHectare", "subsidyNetContribution"],
    },
    ports: {
      inputs: [
        {
          id: "marketReturnPerHectare",
          label: "Market Return Per Hectare",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "subsidyPerHectare",
          label: "Subsidy Per Hectare",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "complianceCostPerHectare",
          label: "Compliance Cost Per Hectare",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netReturnPerHectare",
          label: "Net Return Per Hectare",
          valueType: { type: "number" },
        },
        {
          id: "subsidyNetContribution",
          label: "Subsidy Net Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = subsidyPerHectareNetReturnTool.execute;
export default subsidyPerHectareNetReturnTool;
