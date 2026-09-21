import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packageMass: number;
  readonly labelPercents: readonly number[];
};
export type Output = {
  readonly componentMasses: readonly number[];
  readonly unassignedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packageMass: { type: "number", minimum: 0 },
    labelPercents: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["packageMass", "labelPercents"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentMasses: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    unassignedMass: { type: "number" },
  },
  required: ["componentMasses", "unassignedMass"],
} as const;
/** Calculate fertilizer label mass percent total term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packageMass, labelPercents } = request;
  const compute = (): Output => {
    H.domain(
      packageMass >= 0 &&
        labelPercents.every((x) => x >= 0) &&
        labelPercents.reduce((a, b) => a + b, 0) <= 100,
    );
    return {
      componentMasses: labelPercents.map((x) => (packageMass * x) / 100),
      unassignedMass:
        packageMass * (1 - labelPercents.reduce((a, b) => a + b, 0) / 100),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { packageMass: 100, labelPercents: [10, 20, 30] },
  output: { componentMasses: [10, 20, 30], unassignedMass: 40 },
} satisfies ToolExample<Input, Output>;
export const fertilizerLabelMassPercentTotalTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agrochemistry/fertilizer-label-mass-percent-total-term",
      title: "Fertilizer Label Mass Percent Total Term Tool",
      description:
        "Calculate fertilizer label mass percent total term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          packageMass: { type: "number", minimum: 0 },
          labelPercents: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["packageMass", "labelPercents"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          componentMasses: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          unassignedMass: { type: "number" },
        },
        required: ["componentMasses", "unassignedMass"],
      },
      ports: {
        inputs: [
          {
            id: "packageMass",
            label: "Package Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "labelPercents",
            label: "Label Percents",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "componentMasses",
            label: "Component Masses",
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "unassignedMass",
            label: "Unassigned Mass",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = fertilizerLabelMassPercentTotalTermTool.execute;
export default fertilizerLabelMassPercentTotalTermTool;
