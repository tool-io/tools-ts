import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputUnits: number;
  readonly firstPassYield: number;
  readonly reworkFraction: number;
  readonly reworkSuccess: number;
};
export type Output = {
  readonly firstPassGood: number;
  readonly reworkInput: number;
  readonly finalGood: number;
  readonly scrap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputUnits: { type: "integer", minimum: 0 },
    firstPassYield: { type: "number", minimum: 0, maximum: 1 },
    reworkFraction: { type: "number", minimum: 0, maximum: 1 },
    reworkSuccess: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["inputUnits", "firstPassYield", "reworkFraction", "reworkSuccess"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPassGood: { type: "number" },
    reworkInput: { type: "number" },
    finalGood: { type: "number" },
    scrap: { type: "number" },
  },
  required: ["firstPassGood", "reworkInput", "finalGood", "scrap"],
} as const;
/** Expected one-pass rework flow without integer rounding, repeated rework loops or a quality acceptance policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputUnits, firstPassYield, reworkFraction, reworkSuccess } = request;
  const compute = (): Output => {
    H.integer(inputUnits, 0);
    H.probability(firstPassYield);
    H.probability(reworkFraction);
    H.probability(reworkSuccess);
    return {
      firstPassGood: inputUnits * firstPassYield,
      reworkInput: inputUnits * (1 - firstPassYield) * reworkFraction,
      finalGood:
        inputUnits *
        (firstPassYield +
          (1 - firstPassYield) * reworkFraction * reworkSuccess),
      scrap:
        inputUnits *
        (1 - firstPassYield) *
        (1 - reworkFraction * reworkSuccess),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inputUnits: 1000,
    firstPassYield: 0.8,
    reworkFraction: 0.5,
    reworkSuccess: 0.9,
  },
  output: {
    firstPassGood: 800,
    reworkInput: 99.99999999999997,
    finalGood: 890,
    scrap: 109.99999999999997,
  },
} satisfies ToolExample<Input, Output>;
export const productionYieldReworkOneStepTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/production-yield-rework-one-step-term",
    title: "Production Yield Rework One Step Term Tool",
    description:
      "Expected one-pass rework flow without integer rounding, repeated rework loops or a quality acceptance policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputUnits: { type: "integer", minimum: 0 },
        firstPassYield: { type: "number", minimum: 0, maximum: 1 },
        reworkFraction: { type: "number", minimum: 0, maximum: 1 },
        reworkSuccess: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "inputUnits",
        "firstPassYield",
        "reworkFraction",
        "reworkSuccess",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPassGood: { type: "number" },
        reworkInput: { type: "number" },
        finalGood: { type: "number" },
        scrap: { type: "number" },
      },
      required: ["firstPassGood", "reworkInput", "finalGood", "scrap"],
    },
    ports: {
      inputs: [
        {
          id: "inputUnits",
          label: "Input Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstPassYield",
          label: "First Pass Yield",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reworkFraction",
          label: "Rework Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reworkSuccess",
          label: "Rework Success",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstPassGood",
          label: "First Pass Good",
          valueType: { type: "number" },
        },
        {
          id: "reworkInput",
          label: "Rework Input",
          valueType: { type: "number" },
        },
        { id: "finalGood", label: "Final Good", valueType: { type: "number" } },
        { id: "scrap", label: "Scrap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = productionYieldReworkOneStepTermTool.execute;
export default productionYieldReworkOneStepTermTool;
