import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reporterRate: number;
  readonly reporterStoichiometry: number;
  readonly targetStoichiometry: number;
  readonly couplingYield: number;
};
export type Output = {
  readonly targetRate: number;
  readonly idealTargetRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reporterRate: { type: "number" },
    reporterStoichiometry: { type: "number", exclusiveMinimum: 0 },
    targetStoichiometry: { type: "number", exclusiveMinimum: 0 },
    couplingYield: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: [
    "reporterRate",
    "reporterStoichiometry",
    "targetStoichiometry",
    "couplingYield",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetRate: { type: "number" },
    idealTargetRate: { type: "number" },
  },
  required: ["targetRate", "idealTargetRate"],
} as const;
/** Calculate enzyme coupled stoichiometric rate factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    reporterRate,
    reporterStoichiometry,
    targetStoichiometry,
    couplingYield,
  } = request;
  const compute = (): Output => {
    H.positive(reporterStoichiometry);
    H.positive(targetStoichiometry);
    H.domain(couplingYield > 0 && couplingYield <= 1);
    return {
      targetRate:
        (reporterRate * targetStoichiometry) /
        (reporterStoichiometry * couplingYield),
      idealTargetRate:
        (reporterRate * targetStoichiometry) / reporterStoichiometry,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reporterRate: 10,
    reporterStoichiometry: 2,
    targetStoichiometry: 1,
    couplingYield: 0.5,
  },
  output: { targetRate: 10, idealTargetRate: 5 },
} satisfies ToolExample<Input, Output>;
export const enzymeCoupledStoichiometricRateFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biochemistry/enzyme-coupled-stoichiometric-rate-factor",
      title: "Enzyme Coupled Stoichiometric Rate Factor Tool",
      description:
        "Calculate enzyme coupled stoichiometric rate factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reporterRate: { type: "number" },
          reporterStoichiometry: { type: "number", exclusiveMinimum: 0 },
          targetStoichiometry: { type: "number", exclusiveMinimum: 0 },
          couplingYield: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        },
        required: [
          "reporterRate",
          "reporterStoichiometry",
          "targetStoichiometry",
          "couplingYield",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          targetRate: { type: "number" },
          idealTargetRate: { type: "number" },
        },
        required: ["targetRate", "idealTargetRate"],
      },
      ports: {
        inputs: [
          {
            id: "reporterRate",
            label: "Reporter Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reporterStoichiometry",
            label: "Reporter Stoichiometry",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetStoichiometry",
            label: "Target Stoichiometry",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "couplingYield",
            label: "Coupling Yield",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "targetRate",
            label: "Target Rate",
            valueType: { type: "number" },
          },
          {
            id: "idealTargetRate",
            label: "Ideal Target Rate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = enzymeCoupledStoichiometricRateFactorTool.execute;
export default enzymeCoupledStoichiometricRateFactorTool;
