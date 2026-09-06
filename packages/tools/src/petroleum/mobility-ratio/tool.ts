import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerDisplacingRelativePermeability: number;
  readonly observedDisplacingViscosityPaSeconds: number;
  readonly callerDisplacedRelativePermeability: number;
  readonly observedDisplacedViscosityPaSeconds: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedFrontMobilityRatio: number;
}>;
const inputFields = [
  {
    id: "callerDisplacingRelativePermeability",
    label: "Caller displacing relative permeability",
    kind: "number",
  },
  {
    id: "observedDisplacingViscosityPaSeconds",
    label: "Observed displacing viscosity pa seconds",
    kind: "number",
  },
  {
    id: "callerDisplacedRelativePermeability",
    label: "Caller displaced relative permeability",
    kind: "number",
  },
  {
    id: "observedDisplacedViscosityPaSeconds",
    label: "Observed displaced viscosity pa seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedDisplacingViscosityPaSeconds,
    "observedDisplacingViscosityPaSeconds",
  );
  positive(
    input.callerDisplacedRelativePermeability,
    "callerDisplacedRelativePermeability",
  );
  positive(
    input.observedDisplacedViscosityPaSeconds,
    "observedDisplacedViscosityPaSeconds",
  );
  fraction(
    input.callerDisplacingRelativePermeability,
    "callerDisplacingRelativePermeability",
  );
  fraction(
    input.callerDisplacedRelativePermeability,
    "callerDisplacedRelativePermeability",
  );
  return {
    callerMatchedFrontMobilityRatio:
      input.callerDisplacingRelativePermeability /
      input.observedDisplacingViscosityPaSeconds /
      (input.callerDisplacedRelativePermeability /
        input.observedDisplacedViscosityPaSeconds),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerDisplacingRelativePermeability: 0.4,
  observedDisplacingViscosityPaSeconds: 1,
  callerDisplacedRelativePermeability: 0.8,
  observedDisplacedViscosityPaSeconds: 2,
} satisfies Input;
export const exampleOutput = {
  callerMatchedFrontMobilityRatio: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/mobility-ratio",
  title: "Petroleum Mobility Ratio Calculator",
  description:
    "Evaluate independently matched displacement-front phase mobility ratio, not permeability-independent viscosity ratio or fractional-flow complement; no stability/fingering forecast. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedFrontMobilityRatio",
      label: "Caller matched front mobility ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerDisplacingRelativePermeability:
        value.callerDisplacingRelativePermeability as number,
      observedDisplacingViscosityPaSeconds:
        value.observedDisplacingViscosityPaSeconds as number,
      callerDisplacedRelativePermeability:
        value.callerDisplacedRelativePermeability as number,
      observedDisplacedViscosityPaSeconds:
        value.observedDisplacedViscosityPaSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
