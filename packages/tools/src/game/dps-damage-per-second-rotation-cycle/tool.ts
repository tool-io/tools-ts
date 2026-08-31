import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../shared.js";
export type Input = Readonly<{
  readonly sequentialPhaseDamage: readonly number[];
  readonly sequentialPhaseSeconds: readonly number[];
  readonly callerAdditionalDowntimeSeconds: number;
}>;
export type Output = Readonly<{
  readonly totalRotationDamage: number;
  readonly totalRotationSeconds: number;
  readonly modeledRotationDps: number;
}>;
const inputFields = [
  {
    id: "sequentialPhaseDamage",
    label: "Sequential phase damage",
    kind: "numberList",
  },
  {
    id: "sequentialPhaseSeconds",
    label: "Sequential phase seconds",
    kind: "numberList",
  },
  {
    id: "callerAdditionalDowntimeSeconds",
    label: "Caller additional downtime seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sequentialPhaseDamage.forEach((v) =>
    nonnegative(v, "sequentialPhaseDamage"),
  );
  input.sequentialPhaseSeconds.forEach((v) =>
    nonnegative(v, "sequentialPhaseSeconds"),
  );
  nonnegative(
    input.callerAdditionalDowntimeSeconds,
    "callerAdditionalDowntimeSeconds",
  );
  aligned(
    input.sequentialPhaseDamage,
    input.sequentialPhaseSeconds,
    "sequentialPhaseDamage",
  );
  const total = positive(
      sum(input.sequentialPhaseSeconds) + input.callerAdditionalDowntimeSeconds,
      "cycleDuration",
    ),
    damage = sum(input.sequentialPhaseDamage);
  return {
    totalRotationDamage: damage,
    totalRotationSeconds: total,
    modeledRotationDps: damage / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sequentialPhaseDamage: [100, 200],
  sequentialPhaseSeconds: [1, 2],
  callerAdditionalDowntimeSeconds: 1,
} satisfies Input;
export const exampleOutput = {
  totalRotationDamage: 300,
  totalRotationSeconds: 4,
  modeledRotationDps: 75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/dps-damage-per-second-rotation-cycle",
  title: "DPS Rotation Cycle Calculator",
  description:
    "Audit explicit sequential rotation phase damage/time plus downtime; not unweighted mean of phase DPS or simultaneous/cooldown simulation. Damage/target assumptions are caller observations.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalRotationDamage",
      label: "Total rotation damage",
      kind: "number",
    },
    {
      id: "totalRotationSeconds",
      label: "Total rotation seconds",
      kind: "number",
    },
    { id: "modeledRotationDps", label: "Modeled rotation dps", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequentialPhaseDamage: value.sequentialPhaseDamage as readonly number[],
      sequentialPhaseSeconds: value.sequentialPhaseSeconds as readonly number[],
      callerAdditionalDowntimeSeconds:
        value.callerAdditionalDowntimeSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
