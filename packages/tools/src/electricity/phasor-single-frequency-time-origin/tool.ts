import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly phaseRadians: number;
  readonly angularFrequency: number;
  readonly originShift: number;
};
export type Output = { readonly phaseRadians: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseRadians: { type: "number" },
    angularFrequency: { type: "number" },
    originShift: { type: "number" },
  },
  required: ["phaseRadians", "angularFrequency", "originShift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phaseRadians: { type: "number" } },
  required: ["phaseRadians"],
} as const;
/** For new time coordinate t_new=t_old-originShift, apply phase_new=phase_old+omega*originShift. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { phaseRadians, angularFrequency, originShift } = request;
  const compute = (): Output => {
    return {
      phaseRadians: H.mod(
        phaseRadians + angularFrequency * originShift,
        2 * Math.PI,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    phaseRadians: 0,
    angularFrequency: 3.141592653589793,
    originShift: 0.5,
  },
  output: { phaseRadians: 1.5707963267948966 },
} satisfies ToolExample<Input, Output>;
export const phasorSingleFrequencyTimeOriginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/phasor-single-frequency-time-origin",
    title: "Phasor Single Frequency Time Origin Tool",
    description:
      "For new time coordinate t_new=t_old-originShift, apply phase_new=phase_old+omega*originShift.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseRadians: { type: "number" },
        angularFrequency: { type: "number" },
        originShift: { type: "number" },
      },
      required: ["phaseRadians", "angularFrequency", "originShift"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { phaseRadians: { type: "number" } },
      required: ["phaseRadians"],
    },
    ports: {
      inputs: [
        {
          id: "phaseRadians",
          label: "Phase Radians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angularFrequency",
          label: "Angular Frequency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originShift",
          label: "Origin Shift",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "phaseRadians",
          label: "Phase Radians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = phasorSingleFrequencyTimeOriginTool.execute;
export default phasorSingleFrequencyTimeOriginTool;
