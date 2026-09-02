import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, wrap } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly orientedEastElongationDegrees: number;
}>;
export type Output = Readonly<{
  readonly geometricVisibilitySide: string;
  readonly absoluteElongationDegrees: number;
}>;
const inputFields = [
  {
    id: "orientedEastElongationDegrees",
    label: "Oriented east elongation degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const e = wrap(input.orientedEastElongationDegrees + 180, 360) - 180;
  return {
    geometricVisibilitySide:
      e === 0
        ? "conjunction"
        : Math.abs(e) === 180
          ? "opposition"
          : e > 0
            ? "evening"
            : "morning",
    absoluteElongationDegrees: Math.abs(e),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  orientedEastElongationDegrees: 30,
} satisfies Input;
export const exampleOutput = {
  geometricVisibilitySide: "evening",
  absoluteElongationDegrees: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/planet-elongation-degree-classify-morning-evening",
  title: "Planet Elongation Morning/Evening Classifier",
  description:
    "Signed east-of-Sun elongation convention: east evening, west morning; local altitude, twilight and observability not inferred. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "geometricVisibilitySide",
      label: "Geometric visibility side",
      kind: "string",
    },
    {
      id: "absoluteElongationDegrees",
      label: "Absolute elongation degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      orientedEastElongationDegrees:
        value.orientedEastElongationDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
