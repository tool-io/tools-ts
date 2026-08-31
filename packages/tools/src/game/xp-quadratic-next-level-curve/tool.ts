import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  count,
  bounded,
  at,
} from "../shared.js";
export type Input = Readonly<{
  readonly totalEarnedXp: number;
  readonly quadraticCoefficient: number;
  readonly linearCoefficient: number;
  readonly constantCoefficient: number;
  readonly callerLevelCap: number;
}>;
export type Output = Readonly<{
  readonly resolvedCurrentLevel: number;
  readonly xpIntoCurrentLevel: number;
  readonly nextLevelThresholdXp: string;
  readonly xpNeededForNextLevel: string;
  readonly atCallerLevelCap: boolean;
}>;
const inputFields = [
  { id: "totalEarnedXp", label: "Total earned xp", kind: "number" },
  {
    id: "quadraticCoefficient",
    label: "Quadratic coefficient",
    kind: "number",
  },
  { id: "linearCoefficient", label: "Linear coefficient", kind: "number" },
  { id: "constantCoefficient", label: "Constant coefficient", kind: "number" },
  { id: "callerLevelCap", label: "Caller level cap", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.totalEarnedXp, "xp");
  [
    input.quadraticCoefficient,
    input.linearCoefficient,
    input.constantCoefficient,
  ].forEach((v) => bounded(v, "coefficient", 0, 1000000));
  bounded(input.callerLevelCap, "cap", 1, 1000000);
  if (
    input.quadraticCoefficient + input.linearCoefficient === 0 ||
    input.totalEarnedXp < input.constantCoefficient
  )
    simpleError(
      "curve",
      "Strictly increasing nonnegative quadratic/linear threshold curve and XP at least its level-zero threshold required.",
    );
  const xp = BigInt(input.totalEarnedXp),
    threshold = (l: number) =>
      BigInt(input.quadraticCoefficient) * BigInt(l) ** 2n +
      BigInt(input.linearCoefficient) * BigInt(l) +
      BigInt(input.constantCoefficient);
  let lo = 0,
    hi = input.callerLevelCap;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (threshold(mid) <= xp) lo = mid;
    else hi = mid - 1;
  }
  const capped = lo === input.callerLevelCap,
    next = capped ? null : threshold(lo + 1);
  return {
    resolvedCurrentLevel: lo,
    xpIntoCurrentLevel: Number(xp - threshold(lo)),
    nextLevelThresholdXp: next === null ? "" : next.toString(),
    xpNeededForNextLevel: next === null ? "" : (next - xp).toString(),
    atCallerLevelCap: capped,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  totalEarnedXp: 90,
  quadraticCoefficient: 10,
  linearCoefficient: 0,
  constantCoefficient: 0,
  callerLevelCap: 10,
} satisfies Input;
export const exampleOutput = {
  resolvedCurrentLevel: 3,
  xpIntoCurrentLevel: 0,
  nextLevelThresholdXp: "160",
  xpNeededForNextLevel: "70",
  atCallerLevelCap: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/xp-quadratic-next-level-curve",
  title: "XP Quadratic Next-Level Curve",
  description:
    "Invert caller exact integer cumulative quadratic threshold curve by bounded binary search; canonical decimal next-threshold/gap strings preserve values beyond safe integers. Cap has no next level, represented by empty strings.",
  inputs: inputFields,
  outputs: [
    {
      id: "resolvedCurrentLevel",
      label: "Resolved current level",
      kind: "number",
    },
    {
      id: "xpIntoCurrentLevel",
      label: "Xp into current level",
      kind: "number",
    },
    {
      id: "nextLevelThresholdXp",
      label: "Next level threshold xp",
      kind: "string",
    },
    {
      id: "xpNeededForNextLevel",
      label: "Xp needed for next level",
      kind: "string",
    },
    { id: "atCallerLevelCap", label: "At caller level cap", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      totalEarnedXp: value.totalEarnedXp as number,
      quadraticCoefficient: value.quadraticCoefficient as number,
      linearCoefficient: value.linearCoefficient as number,
      constantCoefficient: value.constantCoefficient as number,
      callerLevelCap: value.callerLevelCap as number,
    }),
});
export const run = tool.execute;
export default tool;
