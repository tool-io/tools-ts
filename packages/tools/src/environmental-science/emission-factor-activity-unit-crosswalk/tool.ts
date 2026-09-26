import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activity: number;
  readonly emissionFactor: number;
  readonly activityUnitScale: number;
};
export type Output = { readonly emissions: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activity: { type: "number", minimum: 0 },
    emissionFactor: { type: "number", minimum: 0 },
    activityUnitScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["activity", "emissionFactor", "activityUnitScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { emissions: { type: "number" } },
  required: ["emissions"],
} as const;
/** Calculate emission factor activity unit crosswalk from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activity, emissionFactor, activityUnitScale } = request;
  const compute = (): Output => {
    H.domain(activity >= 0 && emissionFactor >= 0);
    H.positive(activityUnitScale);
    return { emissions: activity * activityUnitScale * emissionFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { activity: 100, emissionFactor: 0.4, activityUnitScale: 2 },
  output: { emissions: 80 },
} satisfies ToolExample<Input, Output>;
export const emissionFactorActivityUnitCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-science/emission-factor-activity-unit-crosswalk",
      title: "Emission Factor Activity Unit Crosswalk Tool",
      description:
        "Calculate emission factor activity unit crosswalk from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activity: { type: "number", minimum: 0 },
          emissionFactor: { type: "number", minimum: 0 },
          activityUnitScale: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["activity", "emissionFactor", "activityUnitScale"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { emissions: { type: "number" } },
        required: ["emissions"],
      },
      ports: {
        inputs: [
          {
            id: "activity",
            label: "Activity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "emissionFactor",
            label: "Emission Factor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "activityUnitScale",
            label: "Activity Unit Scale",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "emissions",
            label: "Emissions",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = emissionFactorActivityUnitCrosswalkTool.execute;
export default emissionFactorActivityUnitCrosswalkTool;
