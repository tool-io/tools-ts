import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  sum,
  mean,
  aligned,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualMatchedLatitudesDegrees: readonly number[];
  readonly actualMatchedBodySizeMeasurements: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMatchedLatitudesDegrees",
    label: "Actual matched latitudes degrees",
    kind: "numberList",
  },
  {
    id: "actualMatchedBodySizeMeasurements",
    label: "Actual matched body size measurements",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualMatchedLatitudesDegrees,
    input.actualMatchedBodySizeMeasurements,
    "specimens",
  );
  if (
    input.actualMatchedLatitudesDegrees.length < 3 ||
    input.actualMatchedLatitudesDegrees.some((v) => Math.abs(v) > 90)
  )
    simpleError("latitude", "Atleastthreeindependentresolvedlatitudes.");
  input.actualMatchedBodySizeMeasurements.forEach((v) => positive(v, "size"));
  const x = input.actualMatchedLatitudesDegrees.map(Math.abs),
    y = input.actualMatchedBodySizeMeasurements,
    mx = mean(x),
    my = mean(y),
    sx = sum(x.map((v) => (v - mx) ** 2)),
    sy = sum(y.map((v) => (v - my) ** 2));
  positive(sx, "latitudevariance");
  positive(sy, "sizevariance");
  return {
    absoluteLatitudePearsonR:
      sum(x.map((v, i) => (v - mx) * (y[i] - my))) / Math.sqrt(sx * sy),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualMatchedLatitudesDegrees: [-10, 20, 30],
    actualMatchedBodySizeMeasurements: [1, 2, 3],
  },
  output: { result: { absoluteLatitudePearsonR: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/bergmann-latitude-correlation",
  title: "Bergmann Latitude Body Size Correlation Calculator",
  description:
    "ObservedPearsonbody-sizeversusABSOLUTEpaleolatitudecorrelation,not signedlatitude/no sensitivegroupclassification or causalBergmannlawverification. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
