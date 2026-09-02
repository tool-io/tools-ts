import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly independentlyAssayedHoneyGlucoseG: number;
  readonly independentlyAssayedHoneyWaterG: number;
  readonly callerMatchedGranulationRatioThreshold: number;
}>;
export type Output = Readonly<{
  readonly observedGlucoseWaterMassRatio: number;
  readonly callerGranulationRatioScreen: boolean;
}>;
const inputFields = [
  {
    id: "independentlyAssayedHoneyGlucoseG",
    label: "Independently assayed honey glucose g",
    kind: "number",
  },
  {
    id: "independentlyAssayedHoneyWaterG",
    label: "Independently assayed honey water g",
    kind: "number",
  },
  {
    id: "callerMatchedGranulationRatioThreshold",
    label: "Caller matched granulation ratio threshold",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.independentlyAssayedHoneyWaterG,
    "independentlyAssayedHoneyWaterG",
  );
  nonnegative(
    input.independentlyAssayedHoneyGlucoseG,
    "independentlyAssayedHoneyGlucoseG",
  );
  nonnegative(
    input.callerMatchedGranulationRatioThreshold,
    "callerMatchedGranulationRatioThreshold",
  );
  const r =
    input.independentlyAssayedHoneyGlucoseG /
    input.independentlyAssayedHoneyWaterG;
  return {
    observedGlucoseWaterMassRatio: r,
    callerGranulationRatioScreen:
      r >= input.callerMatchedGranulationRatioThreshold,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlyAssayedHoneyGlucoseG: 30,
  independentlyAssayedHoneyWaterG: 20,
  callerMatchedGranulationRatioThreshold: 1.7,
} satisfies Input;
export const exampleOutput = {
  observedGlucoseWaterMassRatio: 1.5,
  callerGranulationRatioScreen: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/honey-granulation-glucose-ratio-lookup",
  title: "Honey Granulation Glucose Ratio Lookup",
  description:
    "Same-lot independently assayed glucose/water mass ratio vs caller matching granulation screen; not sugar/water recipe or crystal-rate/shelf-life guarantee. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedGlucoseWaterMassRatio",
      label: "Observed glucose water mass ratio",
      kind: "number",
    },
    {
      id: "callerGranulationRatioScreen",
      label: "Caller granulation ratio screen",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      independentlyAssayedHoneyGlucoseG:
        value.independentlyAssayedHoneyGlucoseG as number,
      independentlyAssayedHoneyWaterG:
        value.independentlyAssayedHoneyWaterG as number,
      callerMatchedGranulationRatioThreshold:
        value.callerMatchedGranulationRatioThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
