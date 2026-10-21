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
import { convertLengthValue } from "../../convert/length/tool.js";
import { convertTemperature } from "../../convert/temperature/tool.js";
const lengthPairs = [
  ["m", "ft"],
  ["km", "mi"],
  ["cm", "in"],
  ["yd", "m"],
] as const;
const temperaturePairs = [
  ["C", "F"],
  ["F", "C"],
  ["C", "K"],
  ["K", "C"],
] as const;
export type RandomUnitConversionExerciseInput = {
  readonly exerciseCount: number;
  readonly maximumMagnitude: number;
};
export type RandomUnitConversionExerciseOutput = {
  readonly exercises: ReadonlyArray<
    NonNullable<
      ReturnType<typeof calculateRandomUnitConversionExercise>
    >["exercises"][number]
  >;
};
export const calculateRandomUnitConversionExercise = (
  i: RandomUnitConversionExerciseInput,
  r: RandomSource = Math.random,
) => {
  if (
    !Number.isSafeInteger(i.exerciseCount) ||
    i.exerciseCount < 1 ||
    i.exerciseCount > 64 ||
    !Number.isFinite(i.maximumMagnitude) ||
    i.maximumMagnitude <= 0 ||
    i.maximumMagnitude > 1000000
  )
    return null;
  const exercises = [];
  for (let n = 0; n < i.exerciseCount; n++) {
    const kind = integer(0, 1, r),
      pairIndex = integer(0, 3, r);
    const sample = sampleRandomSource(r);
    if (kind === null || pairIndex === null || sample === null) return null;
    const value = sample * i.maximumMagnitude;
    if (kind === 0) {
      const [fromUnit, toUnit] = lengthPairs[pairIndex]!;
      exercises.push({
        kind: "length" as const,
        fromUnit,
        toUnit,
        value,
        answer: convertLengthValue(value, fromUnit, toUnit),
      });
    } else {
      const [fromUnit, toUnit] = temperaturePairs[pairIndex]!;
      const answer = convertTemperature(value, fromUnit, toUnit);
      if (answer === null) return null;
      exercises.push({
        kind: "temperature" as const,
        fromUnit,
        toUnit,
        value,
        answer,
      });
    }
  }
  return { exercises };
};
export const randomUnitConversionExerciseExample = {
  input: { exerciseCount: 8, maximumMagnitude: 100 },
} satisfies ToolExample<
  RandomUnitConversionExerciseInput,
  { readonly result: RandomUnitConversionExerciseOutput }
>;
export const randomUnitConversionExerciseTool = createSimpleTool({
  calculate: (x, c) => {
    const o = calculateRandomUnitConversionExercise(
      x as RandomUnitConversionExerciseInput,
      c.random ?? Math.random,
    );
    if (!o)
      return simpleError(
        "exerciseCount",
        "Provide a bounded positive magnitude, exercise count, and valid randomness.",
        "invalid_conversion_request",
      );
    return { result: o };
  },
  description:
    "Generate supported length and temperature conversion questions with explicit units and computed answers.",
  id: "random/unit-conversion-exercise",
  inputs: [
    {
      id: "exerciseCount",
      kind: "integer",
      label: "Exercise count",
      minimum: 1,
      maximum: 64,
    },
    {
      id: "maximumMagnitude",
      kind: "number",
      label: "Maximum magnitude",
      minimum: 0,
      maximum: 1000000,
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
              anyOf: [
                {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    kind: { type: "string", const: "length" },
                    fromUnit: {
                      anyOf: [
                        { type: "string", const: "cm" },
                        { type: "string", const: "km" },
                        { type: "string", const: "m" },
                        { type: "string", const: "yd" },
                      ],
                    },
                    toUnit: {
                      anyOf: [
                        { type: "string", const: "ft" },
                        { type: "string", const: "in" },
                        { type: "string", const: "m" },
                        { type: "string", const: "mi" },
                      ],
                    },
                    value: { type: "number" },
                    answer: { type: "number" },
                  },
                  required: ["kind", "fromUnit", "toUnit", "value", "answer"],
                },
                {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    kind: { type: "string", const: "temperature" },
                    fromUnit: {
                      anyOf: [
                        { type: "string", const: "C" },
                        { type: "string", const: "F" },
                        { type: "string", const: "K" },
                      ],
                    },
                    toUnit: {
                      anyOf: [
                        { type: "string", const: "C" },
                        { type: "string", const: "F" },
                        { type: "string", const: "K" },
                      ],
                    },
                    value: { type: "number" },
                    answer: { type: "number" },
                  },
                  required: ["kind", "fromUnit", "toUnit", "value", "answer"],
                },
              ],
            },
          },
        },
        required: ["exercises"],
      },
    },
  ],
  title: "Random Unit Conversion Exercise Generator",
});
export const runRandomUnitConversionExercise =
  randomUnitConversionExerciseTool.execute;
export default randomUnitConversionExerciseTool;
