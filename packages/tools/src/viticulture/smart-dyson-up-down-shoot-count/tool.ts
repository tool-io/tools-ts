import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  rowInventory,
} from "../shared.js";
export type Input = Readonly<{
  readonly upwardShootCountsByVine: readonly number[];
  readonly downwardShootCountsByVine: readonly number[];
  readonly representedVineCounts: readonly number[];
  readonly curtainRowLengthsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalRepresentedUpwardShoots: number;
  readonly totalRepresentedDownwardShoots: number;
  readonly upwardShootShare: number;
  readonly signedDirectionCountImbalance: number;
  readonly upwardShootDensityPerMeterCurtain: number;
}>;
const inputFields = [
  {
    id: "upwardShootCountsByVine",
    label: "Upward shoot counts by vine",
    kind: "numberList",
  },
  {
    id: "downwardShootCountsByVine",
    label: "Downward shoot counts by vine",
    kind: "numberList",
  },
  {
    id: "representedVineCounts",
    label: "Represented vine counts",
    kind: "numberList",
  },
  {
    id: "curtainRowLengthsM",
    label: "Curtain row lengths m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedVineCounts.forEach((v) =>
    positive(v, "representedVineCounts"),
  );
  input.curtainRowLengthsM.forEach((v) => positive(v, "curtainRowLengthsM"));
  input.upwardShootCountsByVine.forEach((v) =>
    count(v, "upwardShootCountsByVine"),
  );
  input.downwardShootCountsByVine.forEach((v) =>
    count(v, "downwardShootCountsByVine"),
  );
  input.representedVineCounts.forEach((v) => count(v, "representedVineCounts"));
  aligned(
    input.upwardShootCountsByVine,
    input.downwardShootCountsByVine,
    "upwardShootCountsByVine",
  );
  aligned(
    input.upwardShootCountsByVine,
    input.representedVineCounts,
    "upwardShootCountsByVine",
  );
  aligned(
    input.upwardShootCountsByVine,
    input.curtainRowLengthsM,
    "upwardShootCountsByVine",
  );
  const u = rowInventory(
      input.upwardShootCountsByVine,
      input.representedVineCounts,
    ),
    d = rowInventory(
      input.downwardShootCountsByVine,
      input.representedVineCounts,
    ),
    n = count(u + d, "shoots", 1),
    length = input.curtainRowLengthsM.reduce(
      (s, v, i) => s + v * input.representedVineCounts[i],
      0,
    );
  return {
    totalRepresentedUpwardShoots: u,
    totalRepresentedDownwardShoots: d,
    upwardShootShare: u / n,
    signedDirectionCountImbalance: (u - d) / n,
    upwardShootDensityPerMeterCurtain: u / length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  upwardShootCountsByVine: [10, 20],
  downwardShootCountsByVine: [10, 10],
  representedVineCounts: [1, 2],
  curtainRowLengthsM: [1, 2],
} satisfies Input;
export const exampleOutput = {
  totalRepresentedUpwardShoots: 50,
  totalRepresentedDownwardShoots: 30,
  upwardShootShare: 0.625,
  signedDirectionCountImbalance: 0.25,
  upwardShootDensityPerMeterCurtain: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/smart-dyson-up-down-shoot-count",
  title: "Smart Dyson Up Down Shoot Count",
  description:
    "Keep actual Smart-Dyson upward/downward inventory, vine representation and curtain-length exposure distinct; no required balance, bud fruitfulness or suitability of canopy training inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalRepresentedUpwardShoots",
      label: "Total represented upward shoots",
      kind: "number",
    },
    {
      id: "totalRepresentedDownwardShoots",
      label: "Total represented downward shoots",
      kind: "number",
    },
    { id: "upwardShootShare", label: "Upward shoot share", kind: "number" },
    {
      id: "signedDirectionCountImbalance",
      label: "Signed direction count imbalance",
      kind: "number",
    },
    {
      id: "upwardShootDensityPerMeterCurtain",
      label: "Upward shoot density per meter curtain",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      upwardShootCountsByVine:
        value.upwardShootCountsByVine as readonly number[],
      downwardShootCountsByVine:
        value.downwardShootCountsByVine as readonly number[],
      representedVineCounts: value.representedVineCounts as readonly number[],
      curtainRowLengthsM: value.curtainRowLengthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
