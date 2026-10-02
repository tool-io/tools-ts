import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rapidity: number;
  readonly velocity: number;
  readonly lightSpeed: number;
};
export type Output = {
  readonly combinedVelocity: number;
  readonly combinedRapidity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rapidity: { type: "number" },
    velocity: { type: "number" },
    lightSpeed: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["rapidity", "velocity", "lightSpeed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    combinedVelocity: { type: "number" },
    combinedRapidity: { type: "number" },
  },
  required: ["combinedVelocity", "combinedRapidity"],
} as const;
/** Calculate relativistic rapidity velocity addend from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rapidity, velocity, lightSpeed } = request;
  const compute = (): Output => {
    H.positive(lightSpeed);
    H.domain(Math.abs(velocity) < lightSpeed);
    const combinedRapidity = rapidity + Math.atanh(velocity / lightSpeed);
    return {
      combinedVelocity: lightSpeed * Math.tanh(combinedRapidity),
      combinedRapidity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rapidity: 0.5493061443340548, velocity: 0, lightSpeed: 10 },
  output: {
    combinedVelocity: 4.999999999999999,
    combinedRapidity: 0.5493061443340548,
  },
} satisfies ToolExample<Input, Output>;
export const relativisticRapidityVelocityAddendTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/relativistic-rapidity-velocity-addend",
    title: "Relativistic Rapidity Velocity Addend Tool",
    description:
      "Calculate relativistic rapidity velocity addend from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rapidity: { type: "number" },
        velocity: { type: "number" },
        lightSpeed: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["rapidity", "velocity", "lightSpeed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        combinedVelocity: { type: "number" },
        combinedRapidity: { type: "number" },
      },
      required: ["combinedVelocity", "combinedRapidity"],
    },
    ports: {
      inputs: [
        {
          id: "rapidity",
          label: "Rapidity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "velocity",
          label: "Velocity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lightSpeed",
          label: "Light Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "combinedVelocity",
          label: "Combined Velocity",
          valueType: { type: "number" },
        },
        {
          id: "combinedRapidity",
          label: "Combined Rapidity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = relativisticRapidityVelocityAddendTool.execute;
export default relativisticRapidityVelocityAddendTool;
