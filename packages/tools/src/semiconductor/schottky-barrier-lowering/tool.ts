import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SchottkyBarrierLoweringInput = {
  readonly electricFieldVCm: number;
  readonly relativePermittivity: number;
};

export type SchottkyBarrierLoweringOutput = {
  readonly barrierLoweringEv: number;
};

const ELEMENTARY_CHARGE_C = 1.602176634e-19;
const EPSILON_0_F_PER_CM = 8.8541878128e-14;

export const schottkyBarrierLoweringExample = {
  input: { electricFieldVCm: 1e5, relativePermittivity: 11.8 },
  output: { barrierLoweringEv: 0.03493292055997656 },
} satisfies ToolExample<
  SchottkyBarrierLoweringInput,
  SchottkyBarrierLoweringOutput
>;

export const calculateSchottkyBarrierLowering = (
  input: SchottkyBarrierLoweringInput,
): SchottkyBarrierLoweringOutput => {
  if (input.electricFieldVCm <= 0)
    simpleError(
      "electricFieldVCm",
      "Electric field must be positive.",
      "invalid_electric_field",
    );
  if (input.relativePermittivity <= 0)
    simpleError(
      "relativePermittivity",
      "Relative permittivity must be positive.",
      "invalid_permittivity",
    );
  return {
    barrierLoweringEv: Math.sqrt(
      (ELEMENTARY_CHARGE_C * input.electricFieldVCm) /
        (4 * Math.PI * EPSILON_0_F_PER_CM * input.relativePermittivity),
    ),
  };
};

export const schottkyBarrierLoweringTool = createSimpleTool({
  calculate: (input) =>
    calculateSchottkyBarrierLowering({
      electricFieldVCm: input.electricFieldVCm as number,
      relativePermittivity: input.relativePermittivity as number,
    }),
  description:
    "Compute the Schottky effect barrier lowering from the electric field and the semiconductor relative permittivity.",
  id: "semiconductor/schottky-barrier-lowering",
  inputs: [
    {
      description: "Electric field at the emitting surface.",
      format: "electric-field",
      id: "electricFieldVCm",
      kind: "number",
      label: "Electric field",
      unit: "V/cm",
    },
    {
      description: "Relative permittivity of the semiconductor.",
      format: "relative-permittivity",
      id: "relativePermittivity",
      kind: "number",
      label: "Relative permittivity",
    },
  ],
  outputs: [
    {
      description: "Schottky barrier lowering.",
      format: "energy-ev",
      id: "barrierLoweringEv",
      kind: "number",
      label: "Barrier lowering",
      unit: "eV",
    },
  ],
  title: "Schottky Barrier Lowering Calculator",
});
export const runSchottkyBarrierLowering = schottkyBarrierLoweringTool.execute;
export default schottkyBarrierLoweringTool;
