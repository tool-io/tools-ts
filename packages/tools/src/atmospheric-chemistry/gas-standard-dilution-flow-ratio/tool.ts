import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly standardConcentration: number;
  readonly standardFlow: number;
  readonly diluentConcentration: number;
  readonly diluentFlow: number;
};
export type Output = {
  readonly totalFlow: number;
  readonly mixtureConcentration: number;
  readonly standardFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    standardConcentration: { type: "number", minimum: 0 },
    standardFlow: { type: "number", minimum: 0 },
    diluentConcentration: { type: "number", minimum: 0 },
    diluentFlow: { type: "number", minimum: 0 },
  },
  required: [
    "standardConcentration",
    "standardFlow",
    "diluentConcentration",
    "diluentFlow",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalFlow: { type: "number" },
    mixtureConcentration: { type: "number" },
    standardFraction: { type: "number" },
  },
  required: ["totalFlow", "mixtureConcentration", "standardFraction"],
} as const;
/** Flows must share the same temperature/pressure reference basis before ideal mixing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    standardConcentration,
    standardFlow,
    diluentConcentration,
    diluentFlow,
  } = request;
  const compute = (): Output => {
    H.domain(
      standardConcentration >= 0 &&
        diluentConcentration >= 0 &&
        standardFlow >= 0 &&
        diluentFlow >= 0 &&
        standardFlow + diluentFlow > 0,
    );
    return {
      totalFlow: standardFlow + diluentFlow,
      mixtureConcentration:
        (standardConcentration * standardFlow +
          diluentConcentration * diluentFlow) /
        (standardFlow + diluentFlow),
      standardFraction: standardFlow / (standardFlow + diluentFlow),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    standardConcentration: 100,
    standardFlow: 1,
    diluentConcentration: 0,
    diluentFlow: 9,
  },
  output: { totalFlow: 10, mixtureConcentration: 10, standardFraction: 0.1 },
} satisfies ToolExample<Input, Output>;
export const gasStandardDilutionFlowRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-chemistry/gas-standard-dilution-flow-ratio",
    title: "Gas Standard Dilution Flow Ratio Tool",
    description:
      "Flows must share the same temperature/pressure reference basis before ideal mixing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        standardConcentration: { type: "number", minimum: 0 },
        standardFlow: { type: "number", minimum: 0 },
        diluentConcentration: { type: "number", minimum: 0 },
        diluentFlow: { type: "number", minimum: 0 },
      },
      required: [
        "standardConcentration",
        "standardFlow",
        "diluentConcentration",
        "diluentFlow",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalFlow: { type: "number" },
        mixtureConcentration: { type: "number" },
        standardFraction: { type: "number" },
      },
      required: ["totalFlow", "mixtureConcentration", "standardFraction"],
    },
    ports: {
      inputs: [
        {
          id: "standardConcentration",
          label: "Standard Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "standardFlow",
          label: "Standard Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "diluentConcentration",
          label: "Diluent Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "diluentFlow",
          label: "Diluent Flow",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "totalFlow", label: "Total Flow", valueType: { type: "number" } },
        {
          id: "mixtureConcentration",
          label: "Mixture Concentration",
          valueType: { type: "number" },
        },
        {
          id: "standardFraction",
          label: "Standard Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gasStandardDilutionFlowRatioTool.execute;
export default gasStandardDilutionFlowRatioTool;
