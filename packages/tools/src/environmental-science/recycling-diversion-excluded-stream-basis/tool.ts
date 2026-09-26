import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly diverted: number;
  readonly totalWaste: number;
  readonly excluded: number;
};
export type Output = {
  readonly denominator: number;
  readonly diversionFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diverted: { type: "number", minimum: 0 },
    totalWaste: { type: "number" },
    excluded: { type: "number", minimum: 0 },
  },
  required: ["diverted", "totalWaste", "excluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "number" },
    diversionFraction: { type: "number" },
  },
  required: ["denominator", "diversionFraction"],
} as const;
/** Calculate recycling diversion excluded stream basis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diverted, totalWaste, excluded } = request;
  const compute = (): Output => {
    H.domain(
      excluded >= 0 &&
        totalWaste > excluded &&
        diverted >= 0 &&
        diverted <= totalWaste - excluded,
    );
    return {
      denominator: totalWaste - excluded,
      diversionFraction: diverted / (totalWaste - excluded),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { diverted: 60, totalWaste: 120, excluded: 20 },
  output: { denominator: 100, diversionFraction: 0.6 },
} satisfies ToolExample<Input, Output>;
export const recyclingDiversionExcludedStreamBasisTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-science/recycling-diversion-excluded-stream-basis",
      title: "Recycling Diversion Excluded Stream Basis Tool",
      description:
        "Calculate recycling diversion excluded stream basis from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          diverted: { type: "number", minimum: 0 },
          totalWaste: { type: "number" },
          excluded: { type: "number", minimum: 0 },
        },
        required: ["diverted", "totalWaste", "excluded"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "number" },
          diversionFraction: { type: "number" },
        },
        required: ["denominator", "diversionFraction"],
      },
      ports: {
        inputs: [
          {
            id: "diverted",
            label: "Diverted",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalWaste",
            label: "Total Waste",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "excluded",
            label: "Excluded",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "number" },
          },
          {
            id: "diversionFraction",
            label: "Diversion Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = recyclingDiversionExcludedStreamBasisTool.execute;
export default recyclingDiversionExcludedStreamBasisTool;
