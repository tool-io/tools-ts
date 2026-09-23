import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly liquidFlow: number;
  readonly gasFlow: number;
  readonly liquidMoleRatio: number;
  readonly anchorLiquidRatio: number;
  readonly anchorGasRatio: number;
};
export type Output = { readonly gasMoleRatio: number; readonly slope: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    liquidFlow: { type: "number", minimum: 0 },
    gasFlow: { type: "number", exclusiveMinimum: 0 },
    liquidMoleRatio: { type: "number", minimum: 0 },
    anchorLiquidRatio: { type: "number", minimum: 0 },
    anchorGasRatio: { type: "number", minimum: 0 },
  },
  required: [
    "liquidFlow",
    "gasFlow",
    "liquidMoleRatio",
    "anchorLiquidRatio",
    "anchorGasRatio",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gasMoleRatio: { type: "number" }, slope: { type: "number" } },
  required: ["gasMoleRatio", "slope"],
} as const;
/** Solute-free-carrier operating line in solute/carrier mole ratios, with explicit inlet anchor and constant carrier flows. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    liquidFlow,
    gasFlow,
    liquidMoleRatio,
    anchorLiquidRatio,
    anchorGasRatio,
  } = request;
  const compute = (): Output => {
    H.domain(
      liquidFlow >= 0 &&
        liquidMoleRatio >= 0 &&
        anchorLiquidRatio >= 0 &&
        anchorGasRatio >= 0,
    );
    H.positive(gasFlow);
    return {
      gasMoleRatio:
        anchorGasRatio +
        (liquidFlow * (liquidMoleRatio - anchorLiquidRatio)) / gasFlow,
      slope: liquidFlow / gasFlow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    liquidFlow: 20,
    gasFlow: 10,
    liquidMoleRatio: 0.3,
    anchorLiquidRatio: 0.1,
    anchorGasRatio: 0.05,
  },
  output: { gasMoleRatio: 0.44999999999999996, slope: 2 },
} satisfies ToolExample<Input, Output>;
export const absorptionOperatingLineOneStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/absorption-operating-line-one-step",
    title: "Absorption Operating Line One Step Tool",
    description:
      "Solute-free-carrier operating line in solute/carrier mole ratios, with explicit inlet anchor and constant carrier flows.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        liquidFlow: { type: "number", minimum: 0 },
        gasFlow: { type: "number", exclusiveMinimum: 0 },
        liquidMoleRatio: { type: "number", minimum: 0 },
        anchorLiquidRatio: { type: "number", minimum: 0 },
        anchorGasRatio: { type: "number", minimum: 0 },
      },
      required: [
        "liquidFlow",
        "gasFlow",
        "liquidMoleRatio",
        "anchorLiquidRatio",
        "anchorGasRatio",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gasMoleRatio: { type: "number" },
        slope: { type: "number" },
      },
      required: ["gasMoleRatio", "slope"],
    },
    ports: {
      inputs: [
        {
          id: "liquidFlow",
          label: "Liquid Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gasFlow",
          label: "Gas Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "liquidMoleRatio",
          label: "Liquid Mole Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "anchorLiquidRatio",
          label: "Anchor Liquid Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "anchorGasRatio",
          label: "Anchor Gas Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "gasMoleRatio",
          label: "Gas Mole Ratio",
          valueType: { type: "number" },
        },
        { id: "slope", label: "Slope", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = absorptionOperatingLineOneStepTool.execute;
export default absorptionOperatingLineOneStepTool;
