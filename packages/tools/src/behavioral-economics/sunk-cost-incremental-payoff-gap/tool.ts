import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly futureBenefit: number;
  readonly futureCost: number;
  readonly sunkCost: number;
  readonly alternativeNet: number;
};
export type Output = {
  readonly incrementalNet: number;
  readonly netIncludingSunk: number;
  readonly advantageOverAlternative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    futureBenefit: { type: "number" },
    futureCost: { type: "number", minimum: 0 },
    sunkCost: { type: "number", minimum: 0 },
    alternativeNet: { type: "number" },
  },
  required: ["futureBenefit", "futureCost", "sunkCost", "alternativeNet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    incrementalNet: { type: "number" },
    netIncludingSunk: { type: "number" },
    advantageOverAlternative: { type: "number" },
  },
  required: ["incrementalNet", "netIncludingSunk", "advantageOverAlternative"],
} as const;
/** Sunk cost is disclosed separately and excluded from incremental comparison. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { futureBenefit, futureCost, sunkCost, alternativeNet } = request;
  const compute = (): Output => {
    H.domain(futureCost >= 0 && sunkCost >= 0);
    return {
      incrementalNet: futureBenefit - futureCost,
      netIncludingSunk: futureBenefit - futureCost - sunkCost,
      advantageOverAlternative: futureBenefit - futureCost - alternativeNet,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    futureBenefit: 150,
    futureCost: 100,
    sunkCost: 200,
    alternativeNet: 20,
  },
  output: {
    incrementalNet: 50,
    netIncludingSunk: -150,
    advantageOverAlternative: 30,
  },
} satisfies ToolExample<Input, Output>;
export const sunkCostIncrementalPayoffGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/sunk-cost-incremental-payoff-gap",
    title: "Sunk Cost Incremental Payoff Gap Tool",
    description:
      "Sunk cost is disclosed separately and excluded from incremental comparison.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        futureBenefit: { type: "number" },
        futureCost: { type: "number", minimum: 0 },
        sunkCost: { type: "number", minimum: 0 },
        alternativeNet: { type: "number" },
      },
      required: ["futureBenefit", "futureCost", "sunkCost", "alternativeNet"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        incrementalNet: { type: "number" },
        netIncludingSunk: { type: "number" },
        advantageOverAlternative: { type: "number" },
      },
      required: [
        "incrementalNet",
        "netIncludingSunk",
        "advantageOverAlternative",
      ],
    },
    ports: {
      inputs: [
        {
          id: "futureBenefit",
          label: "Future Benefit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "futureCost",
          label: "Future Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sunkCost",
          label: "Sunk Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alternativeNet",
          label: "Alternative Net",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "incrementalNet",
          label: "Incremental Net",
          valueType: { type: "number" },
        },
        {
          id: "netIncludingSunk",
          label: "Net Including Sunk",
          valueType: { type: "number" },
        },
        {
          id: "advantageOverAlternative",
          label: "Advantage Over Alternative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sunkCostIncrementalPayoffGapTool.execute;
export default sunkCostIncrementalPayoffGapTool;
