import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inletConcentration: number;
  readonly inletFlow: number;
  readonly outletConcentration: number;
  readonly outletFlow: number;
};
export type Output = {
  readonly inletLoadRate: number;
  readonly outletLoadRate: number;
  readonly removedLoadRate: number;
  readonly fraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inletConcentration: { type: "number" },
    inletFlow: { type: "number", minimum: 0 },
    outletConcentration: { type: "number" },
    outletFlow: { type: "number", minimum: 0 },
  },
  required: [
    "inletConcentration",
    "inletFlow",
    "outletConcentration",
    "outletFlow",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inletLoadRate: { type: "number" },
    outletLoadRate: { type: "number" },
    removedLoadRate: { type: "number" },
    fraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "inletLoadRate",
    "outletLoadRate",
    "removedLoadRate",
    "fraction",
    "defined",
  ],
} as const;
/** Compare supplied stage mass-flow loads while retaining signed background-corrected concentrations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inletConcentration, inletFlow, outletConcentration, outletFlow } =
    request;
  const compute = (): Output => {
    H.domain(inletFlow >= 0 && outletFlow >= 0);
    return {
      inletLoadRate: inletConcentration * inletFlow,
      outletLoadRate: outletConcentration * outletFlow,
      removedLoadRate:
        inletConcentration * inletFlow - outletConcentration * outletFlow,
      fraction:
        inletConcentration * inletFlow !== 0
          ? 1 -
            (outletConcentration * outletFlow) /
              (inletConcentration * inletFlow)
          : 0,
      defined: inletConcentration * inletFlow !== 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inletConcentration: 10,
    inletFlow: 2,
    outletConcentration: 3,
    outletFlow: 2,
  },
  output: {
    inletLoadRate: 20,
    outletLoadRate: 6,
    removedLoadRate: 14,
    fraction: 0.7,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const treatmentStageLoadReductionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/treatment-stage-load-reduction",
    title: "Treatment Stage Load Reduction Tool",
    description:
      "Compare supplied stage mass-flow loads while retaining signed background-corrected concentrations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inletConcentration: { type: "number" },
        inletFlow: { type: "number", minimum: 0 },
        outletConcentration: { type: "number" },
        outletFlow: { type: "number", minimum: 0 },
      },
      required: [
        "inletConcentration",
        "inletFlow",
        "outletConcentration",
        "outletFlow",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inletLoadRate: { type: "number" },
        outletLoadRate: { type: "number" },
        removedLoadRate: { type: "number" },
        fraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "inletLoadRate",
        "outletLoadRate",
        "removedLoadRate",
        "fraction",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "inletConcentration",
          label: "Inlet Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inletFlow",
          label: "Inlet Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outletConcentration",
          label: "Outlet Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outletFlow",
          label: "Outlet Flow",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "inletLoadRate",
          label: "Inlet Load Rate",
          valueType: { type: "number" },
        },
        {
          id: "outletLoadRate",
          label: "Outlet Load Rate",
          valueType: { type: "number" },
        },
        {
          id: "removedLoadRate",
          label: "Removed Load Rate",
          valueType: { type: "number" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = treatmentStageLoadReductionTool.execute;
export default treatmentStageLoadReductionTool;
