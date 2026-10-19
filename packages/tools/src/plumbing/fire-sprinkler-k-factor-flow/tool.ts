import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSprinklerKUsGpmPerSqrtPsi: number;
  readonly actualSprinklerResidualPressurePsi: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerVerifiedSprinklerKUsGpmPerSqrtPsi",
    label: "Caller verified sprinkler k us gpm per sqrt psi",
    kind: "number",
  },
  {
    id: "actualSprinklerResidualPressurePsi",
    label: "Actual sprinkler residual pressure psi",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(
    input.callerVerifiedSprinklerKUsGpmPerSqrtPsi,
    "callerVerifiedSprinklerKUsGpmPerSqrtPsi",
  );
  nonnegative(
    input.actualSprinklerResidualPressurePsi,
    "actualSprinklerResidualPressurePsi",
  );
  return {
    value:
      input.callerVerifiedSprinklerKUsGpmPerSqrtPsi *
      Math.sqrt(input.actualSprinklerResidualPressurePsi),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedSprinklerKUsGpmPerSqrtPsi: 10,
    actualSprinklerResidualPressurePsi: 4,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/fire-sprinkler-k-factor-flow",
  title: "Plumbing Fire Sprinkler K Factor Flow Calculator",
  description:
    "Actual sprinkler QUS gpm=K\u221aPpsi, listed matchedKandresidual\u2014not static\u2014pressure, not full network demand/fire design. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
