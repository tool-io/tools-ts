import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialWorkers: number;
  readonly initialPopulation: number;
  readonly finalWorkers: number;
  readonly finalPopulation: number;
};
export type Output = {
  readonly initialWorkerShare: number;
  readonly finalWorkerShare: number;
  readonly shareChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialWorkers: { type: "number", minimum: 0 },
    initialPopulation: { type: "number", exclusiveMinimum: 0 },
    finalWorkers: { type: "number", minimum: 0 },
    finalPopulation: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "initialWorkers",
    "initialPopulation",
    "finalWorkers",
    "finalPopulation",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialWorkerShare: { type: "number" },
    finalWorkerShare: { type: "number" },
    shareChange: { type: "number" },
  },
  required: ["initialWorkerShare", "finalWorkerShare", "shareChange"],
} as const;
/** Compare explicit worker shares of two supplied populations without estimating a causal demographic dividend. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialWorkers, initialPopulation, finalWorkers, finalPopulation } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(initialPopulation) && initialPopulation > 0,
      "initialPopulation",
    ),
      initialPopulation);
    (H.domain(
      Number.isFinite(finalPopulation) && finalPopulation > 0,
      "finalPopulation",
    ),
      finalPopulation);
    H.domain(
      initialWorkers >= 0 && initialWorkers <= initialPopulation,
      "initialWorkers",
    );
    H.domain(
      finalWorkers >= 0 && finalWorkers <= finalPopulation,
      "finalWorkers",
    );
    return {
      initialWorkerShare: initialWorkers / initialPopulation,
      finalWorkerShare: finalWorkers / finalPopulation,
      shareChange:
        finalWorkers / finalPopulation - initialWorkers / initialPopulation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialWorkers: 50,
    initialPopulation: 100,
    finalWorkers: 75,
    finalPopulation: 100,
  },
  output: {
    initialWorkerShare: 0.5,
    finalWorkerShare: 0.75,
    shareChange: 0.25,
  },
} satisfies ToolExample<Input, Output>;
export const demographicDividendWorkerShareChangeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "demographic-economics/demographic-dividend-worker-share-change",
      title: "Demographic Dividend Worker Share Change Tool",
      description:
        "Compare explicit worker shares of two supplied populations without estimating a causal demographic dividend.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialWorkers: { type: "number", minimum: 0 },
          initialPopulation: { type: "number", exclusiveMinimum: 0 },
          finalWorkers: { type: "number", minimum: 0 },
          finalPopulation: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "initialWorkers",
          "initialPopulation",
          "finalWorkers",
          "finalPopulation",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialWorkerShare: { type: "number" },
          finalWorkerShare: { type: "number" },
          shareChange: { type: "number" },
        },
        required: ["initialWorkerShare", "finalWorkerShare", "shareChange"],
      },
      ports: {
        inputs: [
          {
            id: "initialWorkers",
            label: "Initial Workers",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "initialPopulation",
            label: "Initial Population",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "finalWorkers",
            label: "Final Workers",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "finalPopulation",
            label: "Final Population",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "initialWorkerShare",
            label: "Initial Worker Share",
            valueType: { type: "number" },
          },
          {
            id: "finalWorkerShare",
            label: "Final Worker Share",
            valueType: { type: "number" },
          },
          {
            id: "shareChange",
            label: "Share Change",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = demographicDividendWorkerShareChangeTool.execute;
export default demographicDividendWorkerShareChangeTool;
