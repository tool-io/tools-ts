import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualLineageSurvivorsAtStart: number;
  readonly actualLineageSurvivorsAtEnd: number;
  readonly actualIntervalMyr: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualLineageSurvivorsAtStart",
    label: "Actual lineage survivors at start",
    kind: "number",
  },
  {
    id: "actualLineageSurvivorsAtEnd",
    label: "Actual lineage survivors at end",
    kind: "number",
  },
  { id: "actualIntervalMyr", label: "Actual interval myr", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualLineageSurvivorsAtStart, "start");
  positive(input.actualLineageSurvivorsAtEnd, "end");
  positive(input.actualIntervalMyr, "duration");
  if (input.actualLineageSurvivorsAtEnd > input.actualLineageSurvivorsAtStart)
    simpleError(
      "survivors",
      "Resolvedmatchedclosedcohortsurvival,endoriginationexcluded.",
    );
  return {
    perCapitaExtinctionIntensityPerMyr:
      Math.log(
        input.actualLineageSurvivorsAtStart / input.actualLineageSurvivorsAtEnd,
      ) / input.actualIntervalMyr,
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
    actualLineageSurvivorsAtStart: 10,
    actualLineageSurvivorsAtEnd: 5,
    actualIntervalMyr: 2,
  },
  output: {
    result: { perCapitaExtinctionIntensityPerMyr: 0.34657359027997264 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/extinction-rate-per-lmyr",
  title: "Extinction Rate per Lineage-Million-Year Calculator",
  description:
    "Closedcohortconstantpercapita extinctionintensity\u2212ln(Nsurvive/Nstart)/\u0394Myr,not origination event/exposure renaming;no zero-survivorfiniteestimate. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
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
