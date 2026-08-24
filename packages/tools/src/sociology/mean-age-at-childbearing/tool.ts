import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MeanAgeAtChildbearingInput = {
  readonly birthsByAge: readonly number[];
  readonly motherAges: readonly number[];
};

export type MeanAgeAtChildbearingOutput = {
  readonly meanAgeYears: number;
};

export const meanAgeAtChildbearingExample = {
  input: {
    birthsByAge: [10, 40, 20],
    motherAges: [20, 25, 30],
  },
  output: {
    meanAgeYears: 25.714285714285715,
  },
} satisfies ToolExample<
  MeanAgeAtChildbearingInput,
  MeanAgeAtChildbearingOutput
>;

export const calculateMeanAgeAtChildbearing = (
  input: MeanAgeAtChildbearingInput,
): MeanAgeAtChildbearingOutput => {
  if (input.motherAges.length !== input.birthsByAge.length)
    simpleError(
      "birthsByAge",
      "Every age group needs both an age and a birth count.",
      "length_mismatch",
    );
  if (
    input.birthsByAge.length === 0 ||
    input.birthsByAge.some((births) => !Number.isFinite(births) || births < 0)
  )
    simpleError(
      "birthsByAge",
      "Birth counts must be a nonempty list of finite nonnegative numbers.",
      "invalid_value",
    );
  if (input.motherAges.some((age) => !Number.isFinite(age) || age < 0))
    simpleError(
      "motherAges",
      "Maternal ages must be finite nonnegative numbers.",
      "invalid_value",
    );
  const birthScale = Math.max(...input.birthsByAge);
  if (!(birthScale > 0))
    simpleError(
      "birthsByAge",
      "The birth counts must total a positive number.",
      "invalid_value",
    );
  const scaledBirths = input.birthsByAge.map((births) => births / birthScale);
  const scaledTotalBirths = scaledBirths.reduce(
    (sum, births) => sum + births,
    0,
  );
  const meanAgeYears = input.motherAges.reduce(
    (weightedMean, age, index) =>
      weightedMean + age * (scaledBirths[index] / scaledTotalBirths),
    0,
  );
  if (!Number.isFinite(meanAgeYears))
    simpleError(
      "motherAges",
      "The weighted mean age is outside the finite numeric range.",
      "numeric_range",
    );
  return { meanAgeYears };
};

export const meanAgeAtChildbearingTool = createSimpleTool({
  calculate: (input) =>
    calculateMeanAgeAtChildbearing({
      birthsByAge: input.birthsByAge as readonly number[],
      motherAges: input.motherAges as readonly number[],
    }),
  description:
    "Weight the age schedule of fertility by births to obtain the mean age at childbearing.",
  id: "sociology/mean-age-at-childbearing",
  inputs: [
    {
      description: "Births in each maternal age group.",
      id: "birthsByAge",
      kind: "numberList",
      label: "Births by age",
    },
    {
      description: "Midpoint age of each group, aligned with the births list.",
      id: "motherAges",
      kind: "numberList",
      label: "Mother ages",
      unit: "yr",
    },
  ],
  outputs: [
    {
      description: "Birth-weighted mean maternal age.",
      id: "meanAgeYears",
      kind: "number",
      label: "Mean age",
      unit: "yr",
    },
  ],
  title: "Mean Age at Childbearing Calculator",
});
export const runMeanAgeAtChildbearing = meanAgeAtChildbearingTool.execute;
export default meanAgeAtChildbearingTool;
