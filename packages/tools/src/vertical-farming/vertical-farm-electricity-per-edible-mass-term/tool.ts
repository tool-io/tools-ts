import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly electricity: number;
  readonly harvestedMass: number;
  readonly inedibleMass: number;
};
export type Output = {
  readonly edibleMass: number;
  readonly intensity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    electricity: { type: "number", minimum: 0 },
    harvestedMass: { type: "number" },
    inedibleMass: { type: "number", minimum: 0 },
  },
  required: ["electricity", "harvestedMass", "inedibleMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { edibleMass: { type: "number" }, intensity: { type: "number" } },
  required: ["edibleMass", "intensity"],
} as const;
/** Calculate vertical farm electricity per edible mass term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { electricity, harvestedMass, inedibleMass } = request;
  const compute = (): Output => {
    H.domain(
      electricity >= 0 && harvestedMass > inedibleMass && inedibleMass >= 0,
    );
    return {
      edibleMass: harvestedMass - inedibleMass,
      intensity: electricity / (harvestedMass - inedibleMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { electricity: 100, harvestedMass: 50, inedibleMass: 10 },
  output: { edibleMass: 40, intensity: 2.5 },
} satisfies ToolExample<Input, Output>;
export const verticalFarmElectricityPerEdibleMassTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vertical-farming/vertical-farm-electricity-per-edible-mass-term",
      title: "Vertical Farm Electricity Per Edible Mass Term Tool",
      description:
        "Calculate vertical farm electricity per edible mass term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          electricity: { type: "number", minimum: 0 },
          harvestedMass: { type: "number" },
          inedibleMass: { type: "number", minimum: 0 },
        },
        required: ["electricity", "harvestedMass", "inedibleMass"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          edibleMass: { type: "number" },
          intensity: { type: "number" },
        },
        required: ["edibleMass", "intensity"],
      },
      ports: {
        inputs: [
          {
            id: "electricity",
            label: "Electricity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "harvestedMass",
            label: "Harvested Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inedibleMass",
            label: "Inedible Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "edibleMass",
            label: "Edible Mass",
            valueType: { type: "number" },
          },
          {
            id: "intensity",
            label: "Intensity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = verticalFarmElectricityPerEdibleMassTermTool.execute;
export default verticalFarmElectricityPerEdibleMassTermTool;
