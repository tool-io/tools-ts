import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly declaredExtensionDegrees: readonly number[];
  readonly declaredChromaticAlterations: readonly number[];
}>;
export type Output = Readonly<{
  readonly uniqueTensionCount: number;
  readonly ninthTensionPresent: boolean;
  readonly eleventhTensionPresent: boolean;
  readonly thirteenthTensionPresent: boolean;
  readonly tensionSpellings: readonly string[];
}>;
const inputFields = [
  {
    id: "declaredExtensionDegrees",
    label: "Declared extension degrees",
    kind: "numberList",
  },
  {
    id: "declaredChromaticAlterations",
    label: "Declared chromatic alterations",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.declaredExtensionDegrees,
    input.declaredChromaticAlterations,
    "declaredExtensionDegrees",
  );
  input.declaredExtensionDegrees.forEach((v) => {
    if (![1, 3, 5, 7, 9, 11, 13].includes(v))
      simpleError("degree", "Declared tertian chord degree required.");
  });
  input.declaredChromaticAlterations.forEach((v) => {
    if (![-2, -1, 0, 1, 2].includes(v))
      simpleError("alteration", "Up to double alteration required.");
  });
  const tensions = [
    ...new Set(
      input.declaredExtensionDegrees.flatMap((v, i) =>
        v >= 9
          ? [
              (input.declaredChromaticAlterations[i] < 0
                ? "b".repeat(-input.declaredChromaticAlterations[i])
                : "#".repeat(input.declaredChromaticAlterations[i])) + v,
            ]
          : [],
      ),
    ),
  ];
  return {
    uniqueTensionCount: tensions.length,
    ninthTensionPresent: input.declaredExtensionDegrees.includes(9),
    eleventhTensionPresent: input.declaredExtensionDegrees.includes(11),
    thirteenthTensionPresent: input.declaredExtensionDegrees.includes(13),
    tensionSpellings: tensions,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  declaredExtensionDegrees: [7, 9, 11, 13, 9],
  declaredChromaticAlterations: [0, 0, 1, -1, 0],
} satisfies Input;
export const exampleOutput = {
  uniqueTensionCount: 3,
  ninthTensionPresent: true,
  eleventhTensionPresent: true,
  thirteenthTensionPresent: true,
  tensionSpellings: ["9", "#11", "b13"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/extended-chord-tension-counter",
  title: "Extended Chord Tension Counter (9/11/13)",
  description:
    "Count explicitly declared 9/11/13 tensions preserving chromatic variants and collapsing exact duplicates; degree spelling is required because pitch classes alone cannot distinguish extensions from lower chord members.",
  inputs: inputFields,
  outputs: [
    { id: "uniqueTensionCount", label: "Unique tension count", kind: "number" },
    {
      id: "ninthTensionPresent",
      label: "Ninth tension present",
      kind: "boolean",
    },
    {
      id: "eleventhTensionPresent",
      label: "Eleventh tension present",
      kind: "boolean",
    },
    {
      id: "thirteenthTensionPresent",
      label: "Thirteenth tension present",
      kind: "boolean",
    },
    { id: "tensionSpellings", label: "Tension spellings", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      declaredExtensionDegrees:
        value.declaredExtensionDegrees as readonly number[],
      declaredChromaticAlterations:
        value.declaredChromaticAlterations as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
