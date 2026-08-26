import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AxAverageYearsDyingRuleInput = {
  readonly n: number;
  readonly mx: number;
  readonly method?: "midpoint" | "coaleDemenyInfant";
};

export type AxAverageYearsDyingRuleOutput = {
  readonly averageYearsDying: number;
  readonly probabilityOfDying: number;
};

export const calculateAxAverageYearsDyingRule = (
  input: AxAverageYearsDyingRuleInput,
): AxAverageYearsDyingRuleOutput => {
  if (!(input.n > 0))
    simpleError(
      "n",
      "Interval width must be greater than zero.",
      "invalid_interval",
    );
  if (!(input.mx > 0))
    simpleError(
      "mx",
      "The age-specific death rate must be greater than zero.",
      "invalid_rate",
    );
  const averageYearsDying =
    input.method === "coaleDemenyInfant" ? 0.07 + 1.7 * input.mx : input.n / 2;
  const probabilityOfDying =
    (input.n * input.mx) / (1 + (input.n - averageYearsDying) * input.mx);
  return { averageYearsDying, probabilityOfDying };
};

export const axAverageYearsDyingRuleExample = {
  input: { n: 1, mx: 0.02, method: "midpoint" },
  output: { averageYearsDying: 0.5, probabilityOfDying: 0.019801980198019802 },
} satisfies ToolExample<
  AxAverageYearsDyingRuleInput,
  AxAverageYearsDyingRuleOutput
>;

export const axAverageYearsDyingRuleTool = createSimpleTool({
  id: "demography/ax-average-years-dying-rule",
  title: "AX Average Years Dying Rule Calculator",
  description:
    "Compute the average person-years lived by those dying in an interval under the midpoint rule (a = n/2) or the Coale-Demeny infant rule (a0 = 0.07 + 1.7 m0), then convert the death rate to the life-table probability of dying q = n m / (1 + (n - a) m).",
  inputs: [
    {
      description: "Age interval width n in years.",
      id: "n",
      kind: "number",
      label: "Width n",
      minimum: 0,
    },
    {
      description: "Age-specific death rate m in the interval.",
      id: "mx",
      kind: "number",
      label: "Rate m",
      minimum: 0,
    },
    {
      default: "midpoint",
      description:
        "Separation convention: midpoint n/2 for ordinary intervals, or the Coale-Demeny first-year rule a0 = 0.07 + 1.7 m0.",
      enum: ["midpoint", "coaleDemenyInfant"],
      id: "method",
      kind: "string",
      label: "Rule",
    },
  ],
  outputs: [
    {
      description: "Average years lived by those who die in the interval, a.",
      id: "averageYearsDying",
      kind: "number",
      label: "a(x)",
    },
    {
      description: "Life-table probability of dying q = n m / (1 + (n - a) m).",
      id: "probabilityOfDying",
      kind: "number",
      label: "q(x)",
    },
  ],
  calculate: (input) =>
    calculateAxAverageYearsDyingRule(
      input as unknown as AxAverageYearsDyingRuleInput,
    ),
});

export const runAxAverageYearsDyingRule = axAverageYearsDyingRuleTool.execute;
export default axAverageYearsDyingRuleTool;
