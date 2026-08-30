import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
  bands,
} from "../shared.js";
export type Input = Readonly<{
  readonly normalizedPatchLuminances: readonly number[];
  readonly representedPatchAreas: readonly number[];
  readonly callerContrastGradeLowerEdges: readonly number[];
}>;
export type Output = Readonly<{
  readonly areaWeightedLuminanceContrast: number;
  readonly callerContrastGradeCode: number;
}>;
const inputFields = [
  {
    id: "normalizedPatchLuminances",
    label: "Normalized patch luminances",
    kind: "numberList",
  },
  {
    id: "representedPatchAreas",
    label: "Represented patch areas",
    kind: "numberList",
  },
  {
    id: "callerContrastGradeLowerEdges",
    label: "Caller contrast grade lower edges",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedPatchAreas.forEach((v) =>
    positive(v, "representedPatchAreas"),
  );
  input.normalizedPatchLuminances.forEach((v) =>
    fraction(v, "normalizedPatchLuminances"),
  );
  aligned(
    input.normalizedPatchLuminances,
    input.representedPatchAreas,
    "normalizedPatchLuminances",
  );
  const total = input.representedPatchAreas.reduce((a, b) => a + b, 0),
    m = positive(
      input.normalizedPatchLuminances.reduce(
        (s, v, i) => s + (v * input.representedPatchAreas[i]) / total,
        0,
      ),
      "meanLuminance",
    ),
    areaWeightedLuminanceContrast =
      Math.sqrt(
        input.normalizedPatchLuminances.reduce(
          (s, v, i) =>
            s + ((v - m) ** 2 * input.representedPatchAreas[i]) / total,
          0,
        ),
      ) / m;
  return {
    areaWeightedLuminanceContrast,
    callerContrastGradeCode: bands(
      input.callerContrastGradeLowerEdges,
      areaWeightedLuminanceContrast,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  normalizedPatchLuminances: [0.2, 0.8],
  representedPatchAreas: [1, 1],
  callerContrastGradeLowerEdges: [0, 0.3, 0.7],
} satisfies Input;
export const exampleOutput = {
  areaWeightedLuminanceContrast: 0.6,
  callerContrastGradeCode: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/contrast-pattern-grade",
  title: "Contrast Pattern Grade Estimator",
  description:
    "Grade measured spatial RMS luminance contrast under caller independent bands and physical patch areas; differs from temporal scintillation, no laboratory cut grade or perceptual preference is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "areaWeightedLuminanceContrast",
      label: "Area weighted luminance contrast",
      kind: "number",
    },
    {
      id: "callerContrastGradeCode",
      label: "Caller contrast grade code",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      normalizedPatchLuminances:
        value.normalizedPatchLuminances as readonly number[],
      representedPatchAreas: value.representedPatchAreas as readonly number[],
      callerContrastGradeLowerEdges:
        value.callerContrastGradeLowerEdges as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
