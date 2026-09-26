import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inletFlow: number;
  readonly inletConcentration: number;
  readonly outletFlow: number;
  readonly outletConcentration: number;
};
export type Output = {
  readonly inletMassRate: number;
  readonly outletMassRate: number;
  readonly removedMassRate: number;
  readonly efficiency: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inletFlow: { type: "number", exclusiveMinimum: 0 },
    inletConcentration: { type: "number", exclusiveMinimum: 0 },
    outletFlow: { type: "number", minimum: 0 },
    outletConcentration: { type: "number", minimum: 0 },
  },
  required: [
    "inletFlow",
    "inletConcentration",
    "outletFlow",
    "outletConcentration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inletMassRate: { type: "number" },
    outletMassRate: { type: "number" },
    removedMassRate: { type: "number" },
    efficiency: { type: "number" },
  },
  required: [
    "inletMassRate",
    "outletMassRate",
    "removedMassRate",
    "efficiency",
  ],
} as const;
/** Calculate dust collector inlet outlet mass balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inletFlow, inletConcentration, outletFlow, outletConcentration } =
    request;
  const compute = (): Output => {
    H.positive(inletFlow);
    H.positive(inletConcentration);
    H.domain(outletFlow >= 0 && outletConcentration >= 0);
    return {
      inletMassRate: inletFlow * inletConcentration,
      outletMassRate: outletFlow * outletConcentration,
      removedMassRate:
        inletFlow * inletConcentration - outletFlow * outletConcentration,
      efficiency:
        1 -
        (outletFlow * outletConcentration) / (inletFlow * inletConcentration),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inletFlow: 100,
    inletConcentration: 2,
    outletFlow: 90,
    outletConcentration: 0.2,
  },
  output: {
    inletMassRate: 200,
    outletMassRate: 18,
    removedMassRate: 182,
    efficiency: 0.91,
  },
} satisfies ToolExample<Input, Output>;
export const dustCollectorInletOutletMassBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-engineering/dust-collector-inlet-outlet-mass-balance",
      title: "Dust Collector Inlet Outlet Mass Balance Tool",
      description:
        "Calculate dust collector inlet outlet mass balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inletFlow: { type: "number", exclusiveMinimum: 0 },
          inletConcentration: { type: "number", exclusiveMinimum: 0 },
          outletFlow: { type: "number", minimum: 0 },
          outletConcentration: { type: "number", minimum: 0 },
        },
        required: [
          "inletFlow",
          "inletConcentration",
          "outletFlow",
          "outletConcentration",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inletMassRate: { type: "number" },
          outletMassRate: { type: "number" },
          removedMassRate: { type: "number" },
          efficiency: { type: "number" },
        },
        required: [
          "inletMassRate",
          "outletMassRate",
          "removedMassRate",
          "efficiency",
        ],
      },
      ports: {
        inputs: [
          {
            id: "inletFlow",
            label: "Inlet Flow",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inletConcentration",
            label: "Inlet Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "outletFlow",
            label: "Outlet Flow",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "outletConcentration",
            label: "Outlet Concentration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "inletMassRate",
            label: "Inlet Mass Rate",
            valueType: { type: "number" },
          },
          {
            id: "outletMassRate",
            label: "Outlet Mass Rate",
            valueType: { type: "number" },
          },
          {
            id: "removedMassRate",
            label: "Removed Mass Rate",
            valueType: { type: "number" },
          },
          {
            id: "efficiency",
            label: "Efficiency",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dustCollectorInletOutletMassBalanceTool.execute;
export default dustCollectorInletOutletMassBalanceTool;
