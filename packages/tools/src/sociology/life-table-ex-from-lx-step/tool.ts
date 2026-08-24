import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LifeTableExFromLxStepInput = {
  readonly intervalWidthN?: number;
  readonly lxAgeX: number;
  readonly lxNextAge: number;
  readonly tailPersonYears?: number;
};

export type LifeTableExFromLxStepOutput = {
  readonly lifeExpectancyEx: number;
  readonly personYearsLivedLx: number;
};

export const lifeTableExFromLxStepExample = {
  input: {
    intervalWidthN: 5,
    lxAgeX: 1000,
    lxNextAge: 900,
    tailPersonYears: 4000,
  },
  output: {
    lifeExpectancyEx: 8.75,
    personYearsLivedLx: 4750,
  },
} satisfies ToolExample<
  LifeTableExFromLxStepInput,
  LifeTableExFromLxStepOutput
>;

export const calculateLifeTableExStep = (
  input: LifeTableExFromLxStepInput,
): LifeTableExFromLxStepOutput => {
  const width = input.intervalWidthN ?? 1;
  if (!Number.isFinite(width) || width <= 0)
    simpleError(
      "intervalWidthN",
      "The age interval width must be positive.",
      "invalid_value",
    );
  if (!Number.isFinite(input.lxAgeX) || input.lxAgeX <= 0)
    simpleError(
      "lxAgeX",
      "The radix survivors must be positive.",
      "invalid_value",
    );
  if (
    !Number.isFinite(input.lxNextAge) ||
    input.lxNextAge < 0 ||
    input.lxNextAge > input.lxAgeX
  )
    simpleError(
      "lxNextAge",
      "End-of-interval survivors must be finite, nonnegative, and no greater than start survivors.",
      "invalid_value",
    );
  const tailPersonYears = input.tailPersonYears ?? 0;
  if (!Number.isFinite(tailPersonYears) || tailPersonYears < 0)
    simpleError(
      "tailPersonYears",
      "Tail person-years must be a finite nonnegative number.",
      "invalid_value",
    );
  const averageSurvivors = input.lxAgeX / 2 + input.lxNextAge / 2;
  const personYears = width * averageSurvivors;
  if (!Number.isFinite(personYears))
    simpleError(
      "intervalWidthN",
      "Person-years lived are outside the finite numeric range.",
      "numeric_range",
    );
  const totalPersonYears = personYears + tailPersonYears;
  const lifeExpectancyEx = totalPersonYears / input.lxAgeX;
  if (!Number.isFinite(totalPersonYears) || !Number.isFinite(lifeExpectancyEx))
    simpleError(
      "tailPersonYears",
      "Life expectancy is outside the finite numeric range.",
      "numeric_range",
    );
  return { lifeExpectancyEx, personYearsLivedLx: personYears };
};

export const lifeTableExFromLxStepTool = createSimpleTool({
  calculate: (input) =>
    calculateLifeTableExStep({
      intervalWidthN: input.intervalWidthN as number,
      lxAgeX: input.lxAgeX as number,
      lxNextAge: input.lxNextAge as number,
      tailPersonYears: input.tailPersonYears as number,
    }),
  description:
    "Advance one life table step: form person-years lived from adjacent survivorships and divide by them plus the remaining tail for life expectancy.",
  id: "sociology/life-table-ex-from-lx-step",
  inputs: [
    {
      default: 1,
      description: "Width of the age interval in years.",
      id: "intervalWidthN",
      kind: "number",
      label: "Interval width",
      minimum: Number.MIN_VALUE,
      unit: "yr",
    },
    {
      description: "Survivors to the start of the interval.",
      id: "lxAgeX",
      kind: "number",
      label: "l(x)",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Survivors to the end of the interval.",
      id: "lxNextAge",
      kind: "number",
      label: "l(x+n)",
      minimum: 0,
    },
    {
      default: 0,
      description:
        "Person-years lived beyond this interval by those surviving it.",
      id: "tailPersonYears",
      kind: "number",
      label: "Tail person-years",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Person-years lived between the two ages.",
      id: "personYearsLivedLx",
      kind: "number",
      label: "L(x)",
    },
    {
      description: "Life expectancy at the starting age.",
      id: "lifeExpectancyEx",
      kind: "number",
      label: "e(x)",
      unit: "yr",
    },
  ],
  title: "Life Table e(x) From l(x) Step Calculator",
});
export const runLifeTableExFromLxStep = lifeTableExFromLxStepTool.execute;
export default lifeTableExFromLxStepTool;
