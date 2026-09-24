import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedSum: number;
  readonly observedCount: number;
  readonly missingCount: number;
  readonly minimum: number;
  readonly maximum: number;
};
export type Output = {
  readonly lowerMean: number;
  readonly upperMean: number;
  readonly width: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedSum: { type: "number" },
    observedCount: { type: "integer", minimum: 0 },
    missingCount: { type: "integer", minimum: 0 },
    minimum: { type: "number" },
    maximum: { type: "number" },
  },
  required: [
    "observedSum",
    "observedCount",
    "missingCount",
    "minimum",
    "maximum",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerMean: { type: "number" },
    upperMean: { type: "number" },
    width: { type: "number" },
  },
  required: ["lowerMean", "upperMean", "width"],
} as const;
/** Calculate clinical research missing outcome bound from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedSum, observedCount, missingCount, minimum, maximum } =
    request;
  const compute = (): Output => {
    H.integer(observedCount, 0);
    H.integer(missingCount, 0);
    H.domain(
      observedCount + missingCount > 0 &&
        maximum >= minimum &&
        observedSum >= observedCount * minimum &&
        observedSum <= observedCount * maximum,
    );
    return {
      lowerMean:
        (observedSum + missingCount * minimum) / (observedCount + missingCount),
      upperMean:
        (observedSum + missingCount * maximum) / (observedCount + missingCount),
      width:
        (missingCount * (maximum - minimum)) / (observedCount + missingCount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedSum: 30,
    observedCount: 10,
    missingCount: 2,
    minimum: 0,
    maximum: 10,
  },
  output: {
    lowerMean: 2.5,
    upperMean: 4.166666666666667,
    width: 1.6666666666666667,
  },
} satisfies ToolExample<Input, Output>;
export const clinicalResearchMissingOutcomeBoundTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "clinical-research/clinical-research-missing-outcome-bound",
      title: "Clinical Research Missing Outcome Bound Tool",
      description:
        "Calculate clinical research missing outcome bound from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedSum: { type: "number" },
          observedCount: { type: "integer", minimum: 0 },
          missingCount: { type: "integer", minimum: 0 },
          minimum: { type: "number" },
          maximum: { type: "number" },
        },
        required: [
          "observedSum",
          "observedCount",
          "missingCount",
          "minimum",
          "maximum",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lowerMean: { type: "number" },
          upperMean: { type: "number" },
          width: { type: "number" },
        },
        required: ["lowerMean", "upperMean", "width"],
      },
      ports: {
        inputs: [
          {
            id: "observedSum",
            label: "Observed Sum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "observedCount",
            label: "Observed Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "missingCount",
            label: "Missing Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "minimum",
            label: "Minimum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "maximum",
            label: "Maximum",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "lowerMean",
            label: "Lower Mean",
            valueType: { type: "number" },
          },
          {
            id: "upperMean",
            label: "Upper Mean",
            valueType: { type: "number" },
          },
          { id: "width", label: "Width", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = clinicalResearchMissingOutcomeBoundTool.execute;
export default clinicalResearchMissingOutcomeBoundTool;
