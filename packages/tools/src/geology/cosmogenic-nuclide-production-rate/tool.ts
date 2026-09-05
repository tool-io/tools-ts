import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly referenceProductionAtomsGYear: number;
  readonly independentSiteScaling: number;
  readonly observedMassDepthGCM2: readonly number[];
  readonly attenuationGCM2: number;
}>;
export type Output = Readonly<{
  readonly siteProductionAtomsGYear: readonly number[];
}>;
const inputFields = [
  {
    id: "referenceProductionAtomsGYear",
    label: "Reference production atoms g year",
    kind: "number",
  },
  {
    id: "independentSiteScaling",
    label: "Independent site scaling",
    kind: "number",
  },
  {
    id: "observedMassDepthGCM2",
    label: "Observed mass depth g c m2",
    kind: "numberList",
  },
  { id: "attenuationGCM2", label: "Attenuation g c m2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.independentSiteScaling, "independentSiteScaling");
  positive(input.attenuationGCM2, "attenuationGCM2");
  nonnegative(
    input.referenceProductionAtomsGYear,
    "referenceProductionAtomsGYear",
  );
  input.observedMassDepthGCM2.forEach((v) =>
    nonnegative(v, "observedMassDepthGCM2"),
  );
  return {
    siteProductionAtomsGYear: input.observedMassDepthGCM2.map(
      (z) =>
        input.referenceProductionAtomsGYear *
        input.independentSiteScaling *
        Math.exp(-z / input.attenuationGCM2),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceProductionAtomsGYear: 10,
  independentSiteScaling: 2,
  observedMassDepthGCM2: [0, 2],
  attenuationGCM2: 2,
} satisfies Input;
export const exampleOutput = {
  siteProductionAtomsGYear: [20, 7.357588823428847],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/cosmogenic-nuclide-production-rate",
  title: "Geology Cosmogenic Nuclide Production Rate Calculator",
  description:
    "Declared single spallogenic exponential production-depth model with independent reference/site scaling; not inferred latitude/altitude scaling or muon production. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "siteProductionAtomsGYear",
      label: "Site production atoms g year",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceProductionAtomsGYear:
        value.referenceProductionAtomsGYear as number,
      independentSiteScaling: value.independentSiteScaling as number,
      observedMassDepthGCM2: value.observedMassDepthGCM2 as readonly number[],
      attenuationGCM2: value.attenuationGCM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
