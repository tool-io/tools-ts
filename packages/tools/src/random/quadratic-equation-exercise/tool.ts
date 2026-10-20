import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { sampleRandomSource, type RandomSource } from "../number/tool.js";
const integer = (
  minimum: number,
  maximum: number,
  random: RandomSource,
): number | null => {
  const sample = sampleRandomSource(random);
  return sample === null
    ? null
    : minimum + Math.floor(sample * (maximum - minimum + 1));
};
import { calculateQuadraticEquation } from "../../algebra/quadratic-equation/tool.js";
export type RandomQuadraticEquationExerciseInput = {
  readonly exerciseCount: number;
  readonly rootMagnitude: number;
};
export type RandomQuadraticEquationExerciseOutput = {
  readonly exercises: ReadonlyArray<
    NonNullable<
      ReturnType<typeof calculateRandomQuadraticEquationExercise>
    >["exercises"][number]
  >;
};
export const calculateRandomQuadraticEquationExercise = (
  i: RandomQuadraticEquationExerciseInput,
  r: RandomSource = Math.random,
) => {
  if (
    !Number.isSafeInteger(i.exerciseCount) ||
    i.exerciseCount < 1 ||
    i.exerciseCount > 64 ||
    !Number.isSafeInteger(i.rootMagnitude) ||
    i.rootMagnitude < 1 ||
    i.rootMagnitude > 1000
  )
    return null;
  const exercises = [];
  for (let n = 0; n < i.exerciseCount; n++) {
    const rootA = integer(-i.rootMagnitude, i.rootMagnitude, r),
      rootB = integer(-i.rootMagnitude, i.rootMagnitude, r);
    if (rootA === null || rootB === null) return null;
    const coefficients = { a: 1, b: -(rootA + rootB), c: rootA * rootB };
    exercises.push({
      coefficients,
      solution: calculateQuadraticEquation(coefficients),
    });
  }
  return { exercises };
};
export const randomQuadraticEquationExerciseExample = {
  input: { exerciseCount: 6, rootMagnitude: 10 },
} satisfies ToolExample<
  RandomQuadraticEquationExerciseInput,
  { readonly result: RandomQuadraticEquationExerciseOutput }
>;
export const randomQuadraticEquationExerciseTool = createSimpleTool({
  calculate: (x, c) => {
    const o = calculateRandomQuadraticEquationExercise(
      x as RandomQuadraticEquationExerciseInput,
      c.random ?? Math.random,
    );
    if (!o)
      return simpleError(
        "exerciseCount",
        "Provide bounded exercise and root ranges with valid randomness.",
        "invalid_quadratic_request",
      );
    return { result: o };
  },
  description:
    "Construct monic quadratics from bounded integer roots and compute verified solution records.",
  id: "random/quadratic-equation-exercise",
  inputs: [
    {
      id: "exerciseCount",
      kind: "integer",
      label: "Exercise count",
      minimum: 1,
      maximum: 64,
    },
    {
      id: "rootMagnitude",
      kind: "integer",
      label: "Root magnitude",
      minimum: 1,
      maximum: 1000,
    },
  ],
  outputs: [
    {
      id: "result",
      kind: "object",
      label: "Generated result",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          exercises: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                coefficients: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    a: { type: "number" },
                    b: { type: "number" },
                    c: { type: "number" },
                  },
                  required: ["a", "b", "c"],
                },
                solution: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    case: {
                      anyOf: [
                        { type: "string", const: "all_real_numbers" },
                        { type: "string", const: "complex_roots" },
                        { type: "string", const: "double_root" },
                        { type: "string", const: "linear" },
                        { type: "string", const: "no_solution" },
                        { type: "string", const: "two_real_roots" },
                      ],
                    },
                    discriminant: { type: "number" },
                    imaginaryPart: { type: "number" },
                    realPart: { type: "number" },
                    roots: { type: "array", items: { type: "number" } },
                  },
                  required: [
                    "case",
                    "discriminant",
                    "imaginaryPart",
                    "realPart",
                    "roots",
                  ],
                },
              },
              required: ["coefficients", "solution"],
            },
          },
        },
        required: ["exercises"],
      },
    },
  ],
  title: "Random Quadratic Equation Exercise Generator",
});
export const runRandomQuadraticEquationExercise =
  randomQuadraticEquationExerciseTool.execute;
export default randomQuadraticEquationExerciseTool;
