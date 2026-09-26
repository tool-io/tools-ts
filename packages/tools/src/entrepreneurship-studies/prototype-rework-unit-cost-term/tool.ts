import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly builtUnits: number;
  readonly failedUnits: number;
  readonly reworkFraction: number;
  readonly reworkCost: number;
  readonly scrapValue: number;
  readonly initialCost: number;
};
export type Output = {
  readonly reworkUnits: number;
  readonly netCost: number;
  readonly costPerSalableUnit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    builtUnits: { type: "integer", minimum: 1 },
    failedUnits: { type: "integer", minimum: 0 },
    reworkFraction: { type: "number", minimum: 0, maximum: 1 },
    reworkCost: { type: "number", minimum: 0 },
    scrapValue: { type: "number", minimum: 0 },
    initialCost: { type: "number", minimum: 0 },
  },
  required: [
    "builtUnits",
    "failedUnits",
    "reworkFraction",
    "reworkCost",
    "scrapValue",
    "initialCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reworkUnits: { type: "number" },
    netCost: { type: "number" },
    costPerSalableUnit: { type: "number" },
  },
  required: ["reworkUnits", "netCost", "costPerSalableUnit"],
} as const;
/** Expected salable-unit cost assuming all reworked units succeed and the unreworked failures yield the supplied scrap value. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    builtUnits,
    failedUnits,
    reworkFraction,
    reworkCost,
    scrapValue,
    initialCost,
  } = request;
  const compute = (): Output => {
    H.integer(builtUnits, 1);
    H.integer(failedUnits, 0, builtUnits);
    H.probability(reworkFraction);
    H.domain(
      reworkCost >= 0 &&
        scrapValue >= 0 &&
        initialCost >= 0 &&
        builtUnits - failedUnits + failedUnits * reworkFraction > 0,
    );
    return {
      reworkUnits: failedUnits * reworkFraction,
      netCost:
        initialCost +
        failedUnits * reworkFraction * reworkCost -
        failedUnits * (1 - reworkFraction) * scrapValue,
      costPerSalableUnit:
        (initialCost +
          failedUnits * reworkFraction * reworkCost -
          failedUnits * (1 - reworkFraction) * scrapValue) /
        (builtUnits - failedUnits + failedUnits * reworkFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    builtUnits: 100,
    failedUnits: 20,
    reworkFraction: 0.5,
    reworkCost: 10,
    scrapValue: 2,
    initialCost: 1000,
  },
  output: { reworkUnits: 10, netCost: 1080, costPerSalableUnit: 12 },
} satisfies ToolExample<Input, Output>;
export const prototypeReworkUnitCostTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/prototype-rework-unit-cost-term",
    title: "Prototype Rework Unit Cost Term Tool",
    description:
      "Expected salable-unit cost assuming all reworked units succeed and the unreworked failures yield the supplied scrap value.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        builtUnits: { type: "integer", minimum: 1 },
        failedUnits: { type: "integer", minimum: 0 },
        reworkFraction: { type: "number", minimum: 0, maximum: 1 },
        reworkCost: { type: "number", minimum: 0 },
        scrapValue: { type: "number", minimum: 0 },
        initialCost: { type: "number", minimum: 0 },
      },
      required: [
        "builtUnits",
        "failedUnits",
        "reworkFraction",
        "reworkCost",
        "scrapValue",
        "initialCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reworkUnits: { type: "number" },
        netCost: { type: "number" },
        costPerSalableUnit: { type: "number" },
      },
      required: ["reworkUnits", "netCost", "costPerSalableUnit"],
    },
    ports: {
      inputs: [
        {
          id: "builtUnits",
          label: "Built Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "failedUnits",
          label: "Failed Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reworkFraction",
          label: "Rework Fraction",
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
          id: "scrapValue",
          label: "Scrap Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialCost",
          label: "Initial Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "reworkUnits",
          label: "Rework Units",
          valueType: { type: "number" },
        },
        { id: "netCost", label: "Net Cost", valueType: { type: "number" } },
        {
          id: "costPerSalableUnit",
          label: "Cost Per Salable Unit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = prototypeReworkUnitCostTermTool.execute;
export default prototypeReworkUnitCostTermTool;
