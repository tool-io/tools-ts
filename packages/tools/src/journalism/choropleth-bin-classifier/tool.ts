import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly values: readonly number[];
  readonly classCount: number;
  readonly method: string;
}>;
export type Output = Readonly<{
  readonly breakpoints: readonly number[];
  readonly classes: readonly number[];
}>;

export const calculate = (input: Input): Output => {
  if (input.values.length === 0 || input.classCount > input.values.length)
    simpleError(
      "classCount",
      "Class count cannot exceed the nonempty value count.",
      "invalid_class_count",
    );
  const sorted = [...input.values].sort((a, b) => a - b);
  let breakpoints: number[];
  if (input.method === "quantile") {
    breakpoints = Array.from(
      { length: input.classCount },
      (_, index) =>
        sorted[
          Math.min(
            sorted.length - 1,
            Math.ceil(((index + 1) * sorted.length) / input.classCount) - 1,
          )
        ],
    );
  } else {
    const n = sorted.length,
      k = input.classCount;
    const lower = Array.from({ length: n + 1 }, () => Array(k + 1).fill(0));
    const variance = Array.from({ length: n + 1 }, () =>
      Array(k + 1).fill(Infinity),
    );
    for (let classes = 1; classes <= k; classes += 1) {
      lower[1][classes] = 1;
      variance[1][classes] = 0;
    }
    for (let length = 2; length <= n; length += 1) {
      let sum = 0,
        sumSquares = 0,
        weight = 0;
      for (let offset = 1; offset <= length; offset += 1) {
        const lowerIndex = length - offset + 1;
        const value = sorted[lowerIndex - 1];
        weight += 1;
        sum += value;
        sumSquares += value * value;
        const current = sumSquares - (sum * sum) / weight;
        const previous = lowerIndex - 1;
        if (previous > 0)
          for (let classes = 2; classes <= k; classes += 1)
            if (
              variance[length][classes] >=
              current + variance[previous][classes - 1]
            ) {
              lower[length][classes] = lowerIndex;
              variance[length][classes] =
                current + variance[previous][classes - 1];
            }
      }
      lower[length][1] = 1;
      variance[length][1] = sumSquares - (sum * sum) / weight;
    }
    breakpoints = Array(k).fill(sorted[n - 1]);
    let count = n;
    for (let classes = k; classes >= 2; classes -= 1) {
      const index = lower[count][classes] - 2;
      breakpoints[classes - 2] = sorted[index];
      count = lower[count][classes] - 1;
    }
  }
  const classes = input.values.map((value) => {
    const index = breakpoints.findIndex((bound) => value <= bound);
    return index < 0 ? breakpoints.length - 1 : index;
  });
  return { breakpoints, classes };
};

export const exampleInput = {
  values: [1, 2, 3, 100],
  classCount: 2,
  method: "jenks",
} satisfies Input;
export const exampleOutput = {
  breakpoints: [3, 100],
  classes: [0, 0, 0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      values: input.values as readonly number[],
      classCount: input.classCount as number,
      method: input.method as string,
    }),
  description:
    "Classify numeric map values with quantile or Jenks natural-break bins.",
  id: "journalism/choropleth-bin-classifier",
  inputs: [
    { id: "values", label: "Map values", kind: "numberList" },
    { id: "classCount", label: "Class count", kind: "integer", minimum: 1 },
    {
      id: "method",
      label: "Classification method",
      kind: "string",
      enum: ["quantile", "jenks"],
    },
  ],
  outputs: [
    { id: "breakpoints", label: "Class upper bounds", kind: "numberList" },
    { id: "classes", label: "Zero-based classes", kind: "numberList" },
  ],
  title: "Choropleth Bin Classifier",
});

export const run = tool.execute;
export default tool;
