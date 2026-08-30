import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly pointOfDepartureDose: number;
  readonly minimumExposureDose: number;
  readonly maximumExposureDose: number;
  readonly comparisonMargin: number;
}>;
export type Output = Readonly<{
  readonly minimumMargin: number;
  readonly maximumMargin: number;
  readonly entireRangeAboveComparison: boolean;
}>;
const inputFields = [
  {
    id: "pointOfDepartureDose",
    label: "Point of departure dose",
    kind: "number",
  },
  { id: "minimumExposureDose", label: "Minimum exposure dose", kind: "number" },
  { id: "maximumExposureDose", label: "Maximum exposure dose", kind: "number" },
  { id: "comparisonMargin", label: "Comparison margin", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.pointOfDepartureDose, "pointOfDepartureDose");
  positive(input.minimumExposureDose, "minimumExposureDose");
  positive(input.maximumExposureDose, "maximumExposureDose");
  positive(input.comparisonMargin, "comparisonMargin");
  if (input.minimumExposureDose > input.maximumExposureDose)
    simpleError(
      "minimumExposureDose",
      "Ordered positive exposure interval required.",
    );
  const minimumMargin = input.pointOfDepartureDose / input.maximumExposureDose,
    maximumMargin = input.pointOfDepartureDose / input.minimumExposureDose;
  return {
    minimumMargin,
    maximumMargin,
    entireRangeAboveComparison: minimumMargin >= input.comparisonMargin,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pointOfDepartureDose: 10,
  minimumExposureDose: 0.1,
  maximumExposureDose: 0.2,
  comparisonMargin: 100,
} satisfies Input;
export const exampleOutput = {
  minimumMargin: 50,
  maximumMargin: 100,
  entireRangeAboveComparison: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/point-of-departure-exposure-margin",
  title: "Margin of Exposure",
  description:
    "Evaluate a point-of-departure/exposure margin interval against a caller comparison margin; all doses share one unit and the screen is not a safe-dose determination.",
  inputs: inputFields,
  outputs: [
    { id: "minimumMargin", label: "Minimum margin", kind: "number" },
    { id: "maximumMargin", label: "Maximum margin", kind: "number" },
    {
      id: "entireRangeAboveComparison",
      label: "Entire range above comparison",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      pointOfDepartureDose: value.pointOfDepartureDose as number,
      minimumExposureDose: value.minimumExposureDose as number,
      maximumExposureDose: value.maximumExposureDose as number,
      comparisonMargin: value.comparisonMargin as number,
    }),
});
export const run = tool.execute;
export default tool;
