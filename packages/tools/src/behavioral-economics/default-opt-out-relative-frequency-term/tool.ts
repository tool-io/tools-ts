import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly optOut: number;
  readonly exposed: number;
  readonly controlOptOut: number;
  readonly controlExposed: number;
};
export type Output = {
  readonly optOutFraction: number;
  readonly controlFraction: number;
  readonly relativeFrequency: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    optOut: { type: "integer", minimum: 0 },
    exposed: { type: "integer", minimum: 1 },
    controlOptOut: { type: "integer", minimum: 1 },
    controlExposed: { type: "integer", minimum: 1 },
  },
  required: ["optOut", "exposed", "controlOptOut", "controlExposed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    optOutFraction: { type: "number" },
    controlFraction: { type: "number" },
    relativeFrequency: { type: "number" },
  },
  required: ["optOutFraction", "controlFraction", "relativeFrequency"],
} as const;
/** Calculate default opt out relative frequency term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { optOut, exposed, controlOptOut, controlExposed } = request;
  const compute = (): Output => {
    H.integer(exposed, 1);
    H.integer(optOut, 0, exposed);
    H.integer(controlExposed, 1);
    H.integer(controlOptOut, 1, controlExposed);
    return {
      optOutFraction: optOut / exposed,
      controlFraction: controlOptOut / controlExposed,
      relativeFrequency: (optOut * controlExposed) / (exposed * controlOptOut),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { optOut: 20, exposed: 100, controlOptOut: 10, controlExposed: 100 },
  output: { optOutFraction: 0.2, controlFraction: 0.1, relativeFrequency: 2 },
} satisfies ToolExample<Input, Output>;
export const defaultOptOutRelativeFrequencyTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/default-opt-out-relative-frequency-term",
    title: "Default Opt Out Relative Frequency Term Tool",
    description:
      "Calculate default opt out relative frequency term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        optOut: { type: "integer", minimum: 0 },
        exposed: { type: "integer", minimum: 1 },
        controlOptOut: { type: "integer", minimum: 1 },
        controlExposed: { type: "integer", minimum: 1 },
      },
      required: ["optOut", "exposed", "controlOptOut", "controlExposed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        optOutFraction: { type: "number" },
        controlFraction: { type: "number" },
        relativeFrequency: { type: "number" },
      },
      required: ["optOutFraction", "controlFraction", "relativeFrequency"],
    },
    ports: {
      inputs: [
        {
          id: "optOut",
          label: "Opt Out",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exposed",
          label: "Exposed",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "controlOptOut",
          label: "Control Opt Out",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "controlExposed",
          label: "Control Exposed",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "optOutFraction",
          label: "Opt Out Fraction",
          valueType: { type: "number" },
        },
        {
          id: "controlFraction",
          label: "Control Fraction",
          valueType: { type: "number" },
        },
        {
          id: "relativeFrequency",
          label: "Relative Frequency",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = defaultOptOutRelativeFrequencyTermTool.execute;
export default defaultOptOutRelativeFrequencyTermTool;
