import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  logEndpoint,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualTestedExposureCoordinates: readonly number[];
  readonly actualIndependentlyQualifiedEndpointFractions: readonly number[];
  readonly callerVerifiedAssayIdentityAndDuration: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTestedExposureCoordinates",
    label: "Actual tested exposure coordinates",
    kind: "numberList",
  },
  {
    id: "actualIndependentlyQualifiedEndpointFractions",
    label: "Actual independently qualified endpoint fractions",
    kind: "numberList",
  },
  {
    id: "callerVerifiedAssayIdentityAndDuration",
    label: "Caller verified assay identity and duration",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.callerVerifiedAssayIdentityAndDuration.trim())
    simpleError(
      "context",
      "Actual independently qualified species/route/endpoint/duration/source required.",
    );
  return {
    observedLogInterpolatedAssayEndpoint: logEndpoint(
      input.actualTestedExposureCoordinates,
      input.actualIndependentlyQualifiedEndpointFractions,
      0.5,
    ),
    assayContext: input.callerVerifiedAssayIdentityAndDuration,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualTestedExposureCoordinates: [1, 10, 100],
    actualIndependentlyQualifiedEndpointFractions: [0.25, 0.5, 0.75],
    callerVerifiedAssayIdentityAndDuration:
      "bee contact-administered lethal dose; actual independently verified source/edition and units",
  },
  output: {
    result: {
      observedLogInterpolatedAssayEndpoint: 10,
      assayContext:
        "bee contact-administered lethal dose; actual independently verified source/edition and units",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/bee-ld50-contact",
  title: "Bee Contact LD50 Calculator",
  description:
    "Observed bee contact-administered lethal dose 50 percent endpoint across independently qualified assay records, not generic mammalian LD50 or cross-species equivalence. Piecewise-linear response versus log exposure, no extrapolation, no fabricated fitted model. Assay protocol, background correction, replicate uncertainty and biological interpretation independent; no test procedures or handling safety advice.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
