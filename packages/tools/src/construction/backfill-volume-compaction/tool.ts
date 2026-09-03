import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly requiredCompactedLayerVolumesM3: readonly number[];
  readonly callerMatchedCompactedToLooseRatios: readonly number[];
  readonly independentlyReusableLooseSoilM3: number;
}>;
export type Output = Readonly<{
  readonly layerLooseBackfillDemandsM3: readonly number[];
  readonly signedLooseImportRequirementM3: number;
}>;
const inputFields = [
  {
    id: "requiredCompactedLayerVolumesM3",
    label: "Required compacted layer volumes m3",
    kind: "numberList",
  },
  {
    id: "callerMatchedCompactedToLooseRatios",
    label: "Caller matched compacted to loose ratios",
    kind: "numberList",
  },
  {
    id: "independentlyReusableLooseSoilM3",
    label: "Independently reusable loose soil m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedCompactedToLooseRatios.forEach((v) =>
    positive(v, "callerMatchedCompactedToLooseRatios"),
  );
  input.requiredCompactedLayerVolumesM3.forEach((v) =>
    nonnegative(v, "requiredCompactedLayerVolumesM3"),
  );
  nonnegative(
    input.independentlyReusableLooseSoilM3,
    "independentlyReusableLooseSoilM3",
  );
  aligned(
    input.requiredCompactedLayerVolumesM3,
    input.callerMatchedCompactedToLooseRatios,
    "requiredCompactedLayerVolumesM3",
  );
  const demands = input.requiredCompactedLayerVolumesM3.map(
    (v, i) => v / input.callerMatchedCompactedToLooseRatios[i],
  );
  return {
    layerLooseBackfillDemandsM3: demands,
    signedLooseImportRequirementM3:
      sum(demands) - input.independentlyReusableLooseSoilM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  requiredCompactedLayerVolumesM3: [10, 20],
  callerMatchedCompactedToLooseRatios: [0.5, 0.8],
  independentlyReusableLooseSoilM3: 5,
} satisfies Input;
export const exampleOutput = {
  layerLooseBackfillDemandsM3: [20, 25],
  signedLooseImportRequirementM3: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/backfill-volume-compaction",
  title: "Backfill Volume With Compaction Calculator",
  description:
    "Layer-specific loose backfill inversion and independent reusable stock offset, signed surplus explicit, not forward scalar compaction conversion. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "layerLooseBackfillDemandsM3",
      label: "Layer loose backfill demands m3",
      kind: "numberList",
    },
    {
      id: "signedLooseImportRequirementM3",
      label: "Signed loose import requirement m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      requiredCompactedLayerVolumesM3:
        value.requiredCompactedLayerVolumesM3 as readonly number[],
      callerMatchedCompactedToLooseRatios:
        value.callerMatchedCompactedToLooseRatios as readonly number[],
      independentlyReusableLooseSoilM3:
        value.independentlyReusableLooseSoilM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
