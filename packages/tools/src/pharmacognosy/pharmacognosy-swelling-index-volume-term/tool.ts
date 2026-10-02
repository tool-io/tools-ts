import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialVolume: number;
  readonly finalVolume: number;
  readonly dryMass: number;
  readonly blankExpansion: number;
};
export type Output = {
  readonly netExpansion: number;
  readonly expansionPerMass: number;
  readonly finalVolumePerMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialVolume: { type: "number", minimum: 0 },
    finalVolume: { type: "number", minimum: 0 },
    dryMass: { type: "number", exclusiveMinimum: 0 },
    blankExpansion: { type: "number", minimum: 0 },
  },
  required: ["initialVolume", "finalVolume", "dryMass", "blankExpansion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netExpansion: { type: "number" },
    expansionPerMass: { type: "number" },
    finalVolumePerMass: { type: "number" },
  },
  required: ["netExpansion", "expansionPerMass", "finalVolumePerMass"],
} as const;
/** Report explicitly supplied volume expansion with a separate blank correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialVolume, finalVolume, dryMass, blankExpansion } = request;
  const compute = (): Output => {
    H.positive(dryMass);
    H.domain(initialVolume >= 0 && finalVolume >= 0 && blankExpansion >= 0);
    return {
      netExpansion: finalVolume - initialVolume - blankExpansion,
      expansionPerMass:
        (finalVolume - initialVolume - blankExpansion) / dryMass,
      finalVolumePerMass: finalVolume / dryMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialVolume: 2, finalVolume: 10, dryMass: 4, blankExpansion: 0.5 },
  output: {
    netExpansion: 7.5,
    expansionPerMass: 1.875,
    finalVolumePerMass: 2.5,
  },
} satisfies ToolExample<Input, Output>;
export const pharmacognosySwellingIndexVolumeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacognosy/pharmacognosy-swelling-index-volume-term",
      title: "Pharmacognosy Swelling Index Volume Term Tool",
      description:
        "Report explicitly supplied volume expansion with a separate blank correction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialVolume: { type: "number", minimum: 0 },
          finalVolume: { type: "number", minimum: 0 },
          dryMass: { type: "number", exclusiveMinimum: 0 },
          blankExpansion: { type: "number", minimum: 0 },
        },
        required: ["initialVolume", "finalVolume", "dryMass", "blankExpansion"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netExpansion: { type: "number" },
          expansionPerMass: { type: "number" },
          finalVolumePerMass: { type: "number" },
        },
        required: ["netExpansion", "expansionPerMass", "finalVolumePerMass"],
      },
      ports: {
        inputs: [
          {
            id: "initialVolume",
            label: "Initial Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "finalVolume",
            label: "Final Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dryMass",
            label: "Dry Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "blankExpansion",
            label: "Blank Expansion",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netExpansion",
            label: "Net Expansion",
            valueType: { type: "number" },
          },
          {
            id: "expansionPerMass",
            label: "Expansion Per Mass",
            valueType: { type: "number" },
          },
          {
            id: "finalVolumePerMass",
            label: "Final Volume Per Mass",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmacognosySwellingIndexVolumeTermTool.execute;
export default pharmacognosySwellingIndexVolumeTermTool;
