import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedAuc: number;
  readonly lastConcentration: number;
  readonly terminalRate: number;
};
export type Output = {
  readonly tailArea: number;
  readonly totalArea: number;
  readonly extrapolatedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedAuc: { type: "number", exclusiveMinimum: 0 },
    lastConcentration: { type: "number", minimum: 0 },
    terminalRate: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedAuc", "lastConcentration", "terminalRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tailArea: { type: "number" },
    totalArea: { type: "number" },
    extrapolatedFraction: { type: "number" },
  },
  required: ["tailArea", "totalArea", "extrapolatedFraction"],
} as const;
/** Calculate pk noncompartmental extrapolated tail share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedAuc, lastConcentration, terminalRate } = request;
  const compute = (): Output => {
    H.domain(observedAuc > 0 && lastConcentration >= 0);
    H.positive(terminalRate);
    return {
      tailArea: lastConcentration / terminalRate,
      totalArea: observedAuc + lastConcentration / terminalRate,
      extrapolatedFraction:
        lastConcentration / (terminalRate * observedAuc + lastConcentration),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedAuc: 40, lastConcentration: 2, terminalRate: 0.5 },
  output: {
    tailArea: 4,
    totalArea: 44,
    extrapolatedFraction: 0.09090909090909091,
  },
} satisfies ToolExample<Input, Output>;
export const pkNoncompartmentalExtrapolatedTailShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacokinetics/pk-noncompartmental-extrapolated-tail-share",
      title: "PK Noncompartmental Extrapolated Tail Share Tool",
      description:
        "Calculate pk noncompartmental extrapolated tail share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedAuc: { type: "number", exclusiveMinimum: 0 },
          lastConcentration: { type: "number", minimum: 0 },
          terminalRate: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["observedAuc", "lastConcentration", "terminalRate"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tailArea: { type: "number" },
          totalArea: { type: "number" },
          extrapolatedFraction: { type: "number" },
        },
        required: ["tailArea", "totalArea", "extrapolatedFraction"],
      },
      ports: {
        inputs: [
          {
            id: "observedAuc",
            label: "Observed Auc",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lastConcentration",
            label: "Last Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "terminalRate",
            label: "Terminal Rate",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "tailArea", label: "Tail Area", valueType: { type: "number" } },
          {
            id: "totalArea",
            label: "Total Area",
            valueType: { type: "number" },
          },
          {
            id: "extrapolatedFraction",
            label: "Extrapolated Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pkNoncompartmentalExtrapolatedTailShareTool.execute;
export default pkNoncompartmentalExtrapolatedTailShareTool;
