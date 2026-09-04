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
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly netPressurePa: number;
  readonly footingWidthM: number;
  readonly soilYoungPa: number;
  readonly poisson: number;
  readonly callerShapeFactor: number;
}>;
export type Output = Readonly<{ readonly elasticImmediateSettlementM: number }>;
const inputFields = [
  { id: "netPressurePa", label: "Net pressure pa", kind: "number" },
  { id: "footingWidthM", label: "Footing width m", kind: "number" },
  { id: "soilYoungPa", label: "Soil young pa", kind: "number" },
  { id: "poisson", label: "Poisson", kind: "number" },
  { id: "callerShapeFactor", label: "Caller shape factor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.poisson >= 0.5)
    simpleError(
      "poisson",
      "Nonnegative stable compressible isotropic soil branchν<.5.",
    );
  positive(input.footingWidthM, "footingWidthM");
  positive(input.soilYoungPa, "soilYoungPa");
  positive(input.callerShapeFactor, "callerShapeFactor");
  nonnegative(input.netPressurePa, "netPressurePa");
  fraction(input.poisson, "poisson");
  return {
    elasticImmediateSettlementM:
      (input.netPressurePa *
        input.footingWidthM *
        (1 - input.poisson ** 2) *
        input.callerShapeFactor) /
      input.soilYoungPa,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  netPressurePa: 10,
  footingWidthM: 2,
  soilYoungPa: 100,
  poisson: 0.3,
  callerShapeFactor: 1,
} satisfies Input;
export const exampleOutput = {
  elasticImmediateSettlementM: 0.182,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/foundation-settlement-immediate",
  title: "Immediate Foundation Settlement Calculator",
  description:
    "Elastic half-space settlement qB(1−ν²) I/E, caller geometry influence factor. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "elasticImmediateSettlementM",
      label: "Elastic immediate settlement m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      netPressurePa: value.netPressurePa as number,
      footingWidthM: value.footingWidthM as number,
      soilYoungPa: value.soilYoungPa as number,
      poisson: value.poisson as number,
      callerShapeFactor: value.callerShapeFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
