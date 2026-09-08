import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
  binary,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedTreePlotAreasM2: readonly number[];
  readonly observedAffectedTreeFractions: readonly number[];
  readonly knownTreeConditionFlags: readonly number[];
  readonly callerCoincidentCo2MeasurementAvailableFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownAffectedTreeAreaM2: number;
  readonly equivalentKnownAffectedDiameterM: number;
  readonly unknownTreeConditionAreaM2: number;
  readonly knownAffectedAreaWithoutCo2EvidenceM2: number;
}>;
const inputFields = [
  {
    id: "observedTreePlotAreasM2",
    label: "Observed tree plot areas m2",
    kind: "numberList",
  },
  {
    id: "observedAffectedTreeFractions",
    label: "Observed affected tree fractions",
    kind: "numberList",
  },
  {
    id: "knownTreeConditionFlags",
    label: "Known tree condition flags",
    kind: "numberList",
  },
  {
    id: "callerCoincidentCo2MeasurementAvailableFlags",
    label: "Caller coincident co2 measurement available flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTreePlotAreasM2.forEach((v) =>
    positive(v, "observedTreePlotAreasM2"),
  );
  input.observedAffectedTreeFractions.forEach((v) =>
    fraction(v, "observedAffectedTreeFractions"),
  );
  binary(input.knownTreeConditionFlags, "knownTreeConditionFlags");
  binary(
    input.callerCoincidentCo2MeasurementAvailableFlags,
    "callerCoincidentCo2MeasurementAvailableFlags",
  );
  aligned(
    input.observedTreePlotAreasM2,
    input.observedAffectedTreeFractions,
    "observedTreePlotAreasM2",
  );
  aligned(
    input.observedTreePlotAreasM2,
    input.knownTreeConditionFlags,
    "observedTreePlotAreasM2",
  );
  aligned(
    input.observedTreePlotAreasM2,
    input.callerCoincidentCo2MeasurementAvailableFlags,
    "observedTreePlotAreasM2",
  );
  const area = sum(
    input.observedTreePlotAreasM2.map((v, i) =>
      input.knownTreeConditionFlags[i]
        ? v * input.observedAffectedTreeFractions[i]
        : 0,
    ),
  );
  return {
    knownAffectedTreeAreaM2: area,
    equivalentKnownAffectedDiameterM: 2 * Math.sqrt(area / Math.PI),
    unknownTreeConditionAreaM2: sum(
      input.observedTreePlotAreasM2.filter(
        (_, i) => !input.knownTreeConditionFlags[i],
      ),
    ),
    knownAffectedAreaWithoutCo2EvidenceM2: sum(
      input.observedTreePlotAreasM2.map((v, i) =>
        input.knownTreeConditionFlags[i] &&
        !input.callerCoincidentCo2MeasurementAvailableFlags[i]
          ? v * input.observedAffectedTreeFractions[i]
          : 0,
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTreePlotAreasM2: [10, 20],
  observedAffectedTreeFractions: [0.5, 0.25],
  knownTreeConditionFlags: [1, 0],
  callerCoincidentCo2MeasurementAvailableFlags: [1, 1],
} satisfies Input;
export const exampleOutput = {
  knownAffectedTreeAreaM2: 5,
  equivalentKnownAffectedDiameterM: 2.5231325220201604,
  unknownTreeConditionAreaM2: 20,
  knownAffectedAreaWithoutCo2EvidenceM2: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/co2-tree-kill-zone-diameter-health",
  title: "CO2 Tree Kill Zone Diameter Health Checker",
  description:
    "Actual documented tree-condition area with coincident CO2-evidence gaps and equivalent circular diameter, no causal attribution/tree health diagnosis or CO2 danger threshold. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownAffectedTreeAreaM2",
      label: "Known affected tree area m2",
      kind: "number",
    },
    {
      id: "equivalentKnownAffectedDiameterM",
      label: "Equivalent known affected diameter m",
      kind: "number",
    },
    {
      id: "unknownTreeConditionAreaM2",
      label: "Unknown tree condition area m2",
      kind: "number",
    },
    {
      id: "knownAffectedAreaWithoutCo2EvidenceM2",
      label: "Known affected area without co2 evidence m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTreePlotAreasM2:
        value.observedTreePlotAreasM2 as readonly number[],
      observedAffectedTreeFractions:
        value.observedAffectedTreeFractions as readonly number[],
      knownTreeConditionFlags:
        value.knownTreeConditionFlags as readonly number[],
      callerCoincidentCo2MeasurementAvailableFlags:
        value.callerCoincidentCo2MeasurementAvailableFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
