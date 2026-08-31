import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../shared.js";
export type Input = Readonly<{
  readonly attackerDice: number;
  readonly defenderDice: number;
}>;
export type Output = Readonly<{
  readonly attackerLossDistribution: readonly number[];
  readonly expectedAttackerLosses: number;
  readonly expectedDefenderLosses: number;
  readonly totalEnumeratedRolls: number;
}>;
const inputFields = [
  { id: "attackerDice", label: "Attacker dice", kind: "number" },
  { id: "defenderDice", label: "Defender dice", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.attackerDice, "attackerDice", 1, 3);
  bounded(input.defenderDice, "defenderDice", 1, 2);
  const compares = Math.min(input.attackerDice, input.defenderDice),
    counts = Array<number>(compares + 1).fill(0),
    total = 6 ** (input.attackerDice + input.defenderDice);
  for (let n = 0; n < total; n++) {
    let code = n;
    const rolls: number[] = [];
    for (let j = 0; j < input.attackerDice + input.defenderDice; j++) {
      rolls.push((code % 6) + 1);
      code = Math.floor(code / 6);
    }
    const a = rolls.slice(0, input.attackerDice).sort((a, b) => b - a),
      d = rolls.slice(input.attackerDice).sort((a, b) => b - a);
    let lost = 0;
    for (let j = 0; j < compares; j++) if (a[j] <= d[j]) lost++;
    counts[lost]++;
  }
  const p = counts.map((v) => v / total),
    loss = p.reduce((s, v, i) => s + v * i, 0);
  return {
    attackerLossDistribution: p,
    expectedAttackerLosses: loss,
    expectedDefenderLosses: compares - loss,
    totalEnumeratedRolls: total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  attackerDice: 3,
  defenderDice: 2,
} satisfies Input;
export const exampleOutput = {
  attackerLossDistribution: [
    0.37165637860082307, 0.3357767489711934, 0.2925668724279835,
  ],
  expectedAttackerLosses: 0.9209104938271605,
  expectedDefenderLosses: 1.0790895061728394,
  totalEnumeratedRolls: 7776,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/risk-attack-odds-3v2-lookup",
  title: "Risk 3v2 Attack Odds Lookup",
  description:
    "Enumerate at most 7776 independent fair-d6 Risk battle rolls, sorting each side and resolving ties for defender; one engagement only, not full territory invasion probability.",
  inputs: inputFields,
  outputs: [
    {
      id: "attackerLossDistribution",
      label: "Attacker loss distribution",
      kind: "numberList",
    },
    {
      id: "expectedAttackerLosses",
      label: "Expected attacker losses",
      kind: "number",
    },
    {
      id: "expectedDefenderLosses",
      label: "Expected defender losses",
      kind: "number",
    },
    {
      id: "totalEnumeratedRolls",
      label: "Total enumerated rolls",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      attackerDice: value.attackerDice as number,
      defenderDice: value.defenderDice as number,
    }),
});
export const run = tool.execute;
export default tool;
