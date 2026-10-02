import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angularFrequency: number;
  readonly originShift: number;
  readonly convention: string;
};
export type Output = { readonly phaseShift: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angularFrequency: { type: "number" },
    originShift: { type: "number" },
    convention: {
      type: "string",
      maxLength: 8192,
      enum: ["minus-omega-t", "plus-omega-t"],
    },
  },
  required: ["angularFrequency", "originShift", "convention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phaseShift: { type: "number" } },
  required: ["phaseShift"],
} as const;
/** Phase offset after substituting old time = new time + supplied origin shift. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angularFrequency, originShift, convention } = request;
  const compute = (): Output => {
    H.domain(["minus-omega-t", "plus-omega-t"].includes(convention));
    return {
      phaseShift:
        (convention === "minus-omega-t" ? -1 : 1) *
        angularFrequency *
        originShift,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angularFrequency: 2, originShift: 3, convention: "minus-omega-t" },
  output: { phaseShift: -6 },
} satisfies ToolExample<Input, Output>;
export const wavePhaseTimeOriginSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/wave-phase-time-origin-sign",
    title: "Wave Phase Time Origin Sign Tool",
    description:
      "Phase offset after substituting old time = new time + supplied origin shift.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angularFrequency: { type: "number" },
        originShift: { type: "number" },
        convention: {
          type: "string",
          maxLength: 8192,
          enum: ["minus-omega-t", "plus-omega-t"],
        },
      },
      required: ["angularFrequency", "originShift", "convention"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { phaseShift: { type: "number" } },
      required: ["phaseShift"],
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
          id: "originShift",
          label: "Origin Shift",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "convention",
          label: "Convention",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "phaseShift",
          label: "Phase Shift",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wavePhaseTimeOriginSignTool.execute;
export default wavePhaseTimeOriginSignTool;
