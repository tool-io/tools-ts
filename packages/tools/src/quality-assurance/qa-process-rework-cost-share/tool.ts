import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPassCost: number;
  readonly reworkCost: number;
  readonly scrapCost: number;
  readonly recoveredCredit: number;
  readonly units: number;
};
export type Output = {
  readonly netCost: number;
  readonly reworkShare: number;
  readonly costPerUnit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPassCost: { type: "number", minimum: 0 },
    reworkCost: { type: "number", minimum: 0 },
    scrapCost: { type: "number", minimum: 0 },
    recoveredCredit: { type: "number", minimum: 0 },
    units: { type: "integer", minimum: 1 },
  },
  required: [
    "firstPassCost",
    "reworkCost",
    "scrapCost",
    "recoveredCredit",
    "units",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netCost: { type: "number" },
    reworkShare: { type: "number" },
    costPerUnit: { type: "number" },
  },
  required: ["netCost", "reworkShare", "costPerUnit"],
} as const;
/** Calculate qa process rework cost share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPassCost, reworkCost, scrapCost, recoveredCredit, units } =
    request;
  const compute = (): Output => {
    H.integer(units, 1);
    H.domain(
      firstPassCost >= 0 &&
        reworkCost >= 0 &&
        scrapCost >= 0 &&
        firstPassCost + reworkCost + scrapCost > 0 &&
        recoveredCredit >= 0,
    );
    return {
      netCost: firstPassCost + reworkCost + scrapCost - recoveredCredit,
      reworkShare: reworkCost / (firstPassCost + reworkCost + scrapCost),
      costPerUnit:
        (firstPassCost + reworkCost + scrapCost - recoveredCredit) / units,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstPassCost: 100,
    reworkCost: 20,
    scrapCost: 10,
    recoveredCredit: 5,
    units: 25,
  },
  output: { netCost: 125, reworkShare: 0.15384615384615385, costPerUnit: 5 },
} satisfies ToolExample<Input, Output>;
export const qaProcessReworkCostShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/qa-process-rework-cost-share",
    title: "QA Process Rework Cost Share Tool",
    description:
      "Calculate qa process rework cost share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPassCost: { type: "number", minimum: 0 },
        reworkCost: { type: "number", minimum: 0 },
        scrapCost: { type: "number", minimum: 0 },
        recoveredCredit: { type: "number", minimum: 0 },
        units: { type: "integer", minimum: 1 },
      },
      required: [
        "firstPassCost",
        "reworkCost",
        "scrapCost",
        "recoveredCredit",
        "units",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netCost: { type: "number" },
        reworkShare: { type: "number" },
        costPerUnit: { type: "number" },
      },
      required: ["netCost", "reworkShare", "costPerUnit"],
    },
    ports: {
      inputs: [
        {
          id: "firstPassCost",
          label: "First Pass Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reworkCost",
          label: "Rework Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scrapCost",
          label: "Scrap Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recoveredCredit",
          label: "Recovered Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "units",
          label: "Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "netCost", label: "Net Cost", valueType: { type: "number" } },
        {
          id: "reworkShare",
          label: "Rework Share",
          valueType: { type: "number" },
        },
        {
          id: "costPerUnit",
          label: "Cost Per Unit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = qaProcessReworkCostShareTool.execute;
export default qaProcessReworkCostShareTool;
