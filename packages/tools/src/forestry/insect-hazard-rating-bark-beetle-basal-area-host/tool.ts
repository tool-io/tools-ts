import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly hostBasalAreasM2: readonly number[];
  readonly otherBasalAreasM2: readonly number[];
  readonly callerHostFractionLowerEdges: readonly number[];
}>;
export type Output = Readonly<{
  readonly hostBasalAreaFractions: readonly number[];
  readonly callerHostDominanceClassCodes: readonly number[];
  readonly pooledHostBasalAreaFraction: number;
}>;
const inputFields = [
  { id: "hostBasalAreasM2", label: "Host basal areas m2", kind: "numberList" },
  {
    id: "otherBasalAreasM2",
    label: "Other basal areas m2",
    kind: "numberList",
  },
  {
    id: "callerHostFractionLowerEdges",
    label: "Caller host fraction lower edges",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.hostBasalAreasM2.forEach((v) => nonnegative(v, "hostBasalAreasM2"));
  input.otherBasalAreasM2.forEach((v) => nonnegative(v, "otherBasalAreasM2"));
  input.callerHostFractionLowerEdges.forEach((v) =>
    fraction(v, "callerHostFractionLowerEdges"),
  );
  aligned(input.hostBasalAreasM2, input.otherBasalAreasM2, "hostBasalAreasM2");
  ordered(input.callerHostFractionLowerEdges, "callerHostFractionLowerEdges");
  if (
    input.callerHostFractionLowerEdges[0] !== 0 ||
    input.callerHostFractionLowerEdges.length > 128
  )
    simpleError(
      "bands",
      "Bounded caller lower edges beginning at zero required.",
    );
  const hostBasalAreaFractions = input.hostBasalAreasM2.map(
    (v, i) => v / positive(v + input.otherBasalAreasM2[i], "totalBasalArea"),
  );
  return {
    hostBasalAreaFractions,
    callerHostDominanceClassCodes: hostBasalAreaFractions.map((v) => {
      const i = input.callerHostFractionLowerEdges.findIndex((x) => x > v);
      return i < 0 ? input.callerHostFractionLowerEdges.length - 1 : i - 1;
    }),
    pooledHostBasalAreaFraction:
      input.hostBasalAreasM2.reduce((a, b) => a + b, 0) /
      input.hostBasalAreasM2.reduce(
        (s, v, i) => s + v + input.otherBasalAreasM2[i],
        0,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  hostBasalAreasM2: [6, 4],
  otherBasalAreasM2: [4, 16],
  callerHostFractionLowerEdges: [0, 0.3, 0.7],
} satisfies Input;
export const exampleOutput = {
  hostBasalAreaFractions: [0.6, 0.2],
  callerHostDominanceClassCodes: [1, 0],
  pooledHostBasalAreaFraction: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/insect-hazard-rating-bark-beetle-basal-area-host",
  title: "Bark Beetle Host Basal Area Hazard Rating",
  description:
    "Classify measured host basal-area share under a caller dominance policy while retaining pooled inventory; host availability alone does not establish beetle outbreak probability or tree hazard.",
  inputs: inputFields,
  outputs: [
    {
      id: "hostBasalAreaFractions",
      label: "Host basal area fractions",
      kind: "numberList",
    },
    {
      id: "callerHostDominanceClassCodes",
      label: "Caller host dominance class codes",
      kind: "numberList",
    },
    {
      id: "pooledHostBasalAreaFraction",
      label: "Pooled host basal area fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      hostBasalAreasM2: value.hostBasalAreasM2 as readonly number[],
      otherBasalAreasM2: value.otherBasalAreasM2 as readonly number[],
      callerHostFractionLowerEdges:
        value.callerHostFractionLowerEdges as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
