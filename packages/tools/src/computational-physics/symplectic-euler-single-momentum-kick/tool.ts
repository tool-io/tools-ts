import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldMomentum: number;
  readonly suppliedForce: number;
  readonly timeStep: number;
};
export type Output = { readonly newMomentum: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldMomentum: { type: "number" },
    suppliedForce: { type: "number" },
    timeStep: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["oldMomentum", "suppliedForce", "timeStep"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { newMomentum: { type: "number" } },
  required: ["newMomentum"],
} as const;
/** Apply one explicit symplectic-Euler momentum kick p_new=p_old+F*dt using the supplied force at the chosen step. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldMomentum, suppliedForce, timeStep } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(timeStep) && timeStep > 0, "timeStep"), timeStep);
    return { newMomentum: oldMomentum + suppliedForce * timeStep };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oldMomentum: 3, suppliedForce: 2, timeStep: 0.5 },
  output: { newMomentum: 4 },
} satisfies ToolExample<Input, Output>;
export const symplecticEulerSingleMomentumKickTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-physics", "computational physics", "physics"],
      keywords: ["computational physics", "physics"],
    },
    id: "computational-physics/symplectic-euler-single-momentum-kick",
    title: "Symplectic Euler Single Momentum Kick",
    description:
      "Apply one explicit symplectic-Euler momentum kick p_new=p_old+F*dt using the supplied force at the chosen step.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldMomentum: { type: "number" },
        suppliedForce: { type: "number" },
        timeStep: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["oldMomentum", "suppliedForce", "timeStep"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { newMomentum: { type: "number" } },
      required: ["newMomentum"],
    },
    ports: {
      inputs: [
        {
          id: "oldMomentum",
          label: "Old Momentum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedForce",
          label: "Supplied Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timeStep",
          label: "Time Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "newMomentum",
          label: "New Momentum",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = symplecticEulerSingleMomentumKickTool.execute;
export default symplecticEulerSingleMomentumKickTool;
