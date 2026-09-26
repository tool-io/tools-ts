import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseFlow: number;
  readonly baseConcentration: number;
  readonly inflow: number;
  readonly inflowConcentration: number;
};
export type Output = { readonly flow: number; readonly concentration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseFlow: { type: "number", minimum: 0 },
    baseConcentration: { type: "number" },
    inflow: { type: "number", minimum: 0 },
    inflowConcentration: { type: "number" },
  },
  required: ["baseFlow", "baseConcentration", "inflow", "inflowConcentration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { flow: { type: "number" }, concentration: { type: "number" } },
  required: ["flow", "concentration"],
} as const;
/** Calculate water quality mixing conservative one inflow from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseFlow, baseConcentration, inflow, inflowConcentration } = request;
  const compute = (): Output => {
    H.domain(baseFlow >= 0 && inflow >= 0);
    H.positive(baseFlow + inflow);
    return {
      flow: baseFlow + inflow,
      concentration:
        (baseFlow * baseConcentration + inflow * inflowConcentration) /
        (baseFlow + inflow),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baseFlow: 8,
    baseConcentration: 2,
    inflow: 2,
    inflowConcentration: 7,
  },
  output: { flow: 10, concentration: 3 },
} satisfies ToolExample<Input, Output>;
export const waterQualityMixingConservativeOneInflowTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-science/water-quality-mixing-conservative-one-inflow",
      title: "Water Quality Mixing Conservative One Inflow Tool",
      description:
        "Calculate water quality mixing conservative one inflow from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baseFlow: { type: "number", minimum: 0 },
          baseConcentration: { type: "number" },
          inflow: { type: "number", minimum: 0 },
          inflowConcentration: { type: "number" },
        },
        required: [
          "baseFlow",
          "baseConcentration",
          "inflow",
          "inflowConcentration",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          flow: { type: "number" },
          concentration: { type: "number" },
        },
        required: ["flow", "concentration"],
      },
      ports: {
        inputs: [
          {
            id: "baseFlow",
            label: "Base Flow",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "baseConcentration",
            label: "Base Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inflow",
            label: "Inflow",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inflowConcentration",
            label: "Inflow Concentration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "flow", label: "Flow", valueType: { type: "number" } },
          {
            id: "concentration",
            label: "Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = waterQualityMixingConservativeOneInflowTool.execute;
export default waterQualityMixingConservativeOneInflowTool;
