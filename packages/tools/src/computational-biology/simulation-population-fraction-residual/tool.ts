import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly counts: readonly number[];
  readonly suppliedFractions: readonly number[];
};
export type Output = {
  readonly countFractions: readonly number[];
  readonly residuals: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counts: { type: "array", maxItems: 256, items: { type: "integer" } },
    suppliedFractions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["counts", "suppliedFractions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countFractions: { type: "array", maxItems: 256, items: { type: "number" } },
    residuals: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["countFractions", "residuals"],
} as const;
/** Compare supplied simulation counts with independently supplied candidate fractions without fitting a biological model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { counts, suppliedFractions } = request;
  const compute = (): Output => {
    H.sameLength(counts, suppliedFractions);
    H.domain(
      counts.every((x) => x >= 0) &&
        counts.reduce((a, b) => a + b, 0) > 0 &&
        suppliedFractions.every((x) => x >= 0 && x <= 1),
    );
    return {
      countFractions: counts.map((x) => x / counts.reduce((a, b) => a + b, 0)),
      residuals: counts.map(
        (x, i) => x / counts.reduce((a, b) => a + b, 0) - suppliedFractions[i],
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { counts: [2, 3, 5], suppliedFractions: [0.2, 0.4, 0.4] },
  output: {
    countFractions: [0.2, 0.3, 0.5],
    residuals: [0, -0.10000000000000003, 0.09999999999999998],
  },
} satisfies ToolExample<Input, Output>;
export const simulationPopulationFractionResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "computational-biology/simulation-population-fraction-residual",
      title: "Simulation Population Fraction Residual Tool",
      description:
        "Compare supplied simulation counts with independently supplied candidate fractions without fitting a biological model.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          counts: { type: "array", maxItems: 256, items: { type: "integer" } },
          suppliedFractions: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["counts", "suppliedFractions"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          countFractions: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          residuals: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["countFractions", "residuals"],
      },
      ports: {
        inputs: [
          {
            id: "counts",
            label: "Counts",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "suppliedFractions",
            label: "Supplied Fractions",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "countFractions",
            label: "Count Fractions",
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "residuals",
            label: "Residuals",
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = simulationPopulationFractionResidualTool.execute;
export default simulationPopulationFractionResidualTool;
