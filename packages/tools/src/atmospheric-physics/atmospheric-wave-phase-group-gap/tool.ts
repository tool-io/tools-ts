import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angularFrequency: number;
  readonly wavenumber: number;
  readonly groupVelocity: number;
};
export type Output = { readonly phaseVelocity: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angularFrequency: { type: "number" },
    wavenumber: { type: "number" },
    groupVelocity: { type: "number" },
  },
  required: ["angularFrequency", "wavenumber", "groupVelocity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phaseVelocity: { type: "number" }, gap: { type: "number" } },
  required: ["phaseVelocity", "gap"],
} as const;
/** Signed group-minus-phase velocity on a shared scalar propagation axis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angularFrequency, wavenumber, groupVelocity } = request;
  const compute = (): Output => {
    H.domain(wavenumber !== 0);
    return {
      phaseVelocity: angularFrequency / wavenumber,
      gap: groupVelocity - angularFrequency / wavenumber,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angularFrequency: 10, wavenumber: 2, groupVelocity: 3 },
  output: { phaseVelocity: 5, gap: -2 },
} satisfies ToolExample<Input, Output>;
export const atmosphericWavePhaseGroupGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/atmospheric-wave-phase-group-gap",
    title: "Atmospheric Wave Phase Group Gap Tool",
    description:
      "Signed group-minus-phase velocity on a shared scalar propagation axis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angularFrequency: { type: "number" },
        wavenumber: { type: "number" },
        groupVelocity: { type: "number" },
      },
      required: ["angularFrequency", "wavenumber", "groupVelocity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseVelocity: { type: "number" },
        gap: { type: "number" },
      },
      required: ["phaseVelocity", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "angularFrequency",
          label: "Angular Frequency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wavenumber",
          label: "Wavenumber",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "groupVelocity",
          label: "Group Velocity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "phaseVelocity",
          label: "Phase Velocity",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = atmosphericWavePhaseGroupGapTool.execute;
export default atmosphericWavePhaseGroupGapTool;
