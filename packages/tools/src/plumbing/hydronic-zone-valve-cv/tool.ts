import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedZoneDesignFlowsGpm: readonly number[];
  readonly callerTargetValveDropsPsi: readonly number[];
  readonly callerMatchedFluidSpecificGravity: readonly number[];
}>;
export type Output = Readonly<{
  readonly requiredZoneValveCv: readonly number[];
}>;
const inputFields = [
  {
    id: "observedZoneDesignFlowsGpm",
    label: "Observed zone design flows gpm",
    kind: "numberList",
  },
  {
    id: "callerTargetValveDropsPsi",
    label: "Caller target valve drops psi",
    kind: "numberList",
  },
  {
    id: "callerMatchedFluidSpecificGravity",
    label: "Caller matched fluid specific gravity",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerTargetValveDropsPsi.forEach((v) =>
    positive(v, "callerTargetValveDropsPsi"),
  );
  input.callerMatchedFluidSpecificGravity.forEach((v) =>
    positive(v, "callerMatchedFluidSpecificGravity"),
  );
  input.observedZoneDesignFlowsGpm.forEach((v) =>
    nonnegative(v, "observedZoneDesignFlowsGpm"),
  );
  aligned(
    input.observedZoneDesignFlowsGpm,
    input.callerTargetValveDropsPsi,
    "observedZoneDesignFlowsGpm",
  );
  aligned(
    input.observedZoneDesignFlowsGpm,
    input.callerMatchedFluidSpecificGravity,
    "observedZoneDesignFlowsGpm",
  );
  return {
    requiredZoneValveCv: input.observedZoneDesignFlowsGpm.map(
      (v, i) =>
        v *
        Math.sqrt(
          input.callerMatchedFluidSpecificGravity[i] /
            input.callerTargetValveDropsPsi[i],
        ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedZoneDesignFlowsGpm: [2, 3],
  callerTargetValveDropsPsi: [1, 4],
  callerMatchedFluidSpecificGravity: [1, 1],
} satisfies Input;
export const exampleOutput = { requiredZoneValveCv: [2, 1.5] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/hydronic-zone-valve-cv",
  title: "Plumbing Hydronic Zone Valve Cv Calculator",
  description:
    "Calculate actual independently calibrated hydronic zone GPM/psi/specific-gravity Cv budgets, distinct from dimensionless valve authority and not nominal SI Kv, hardware or control safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredZoneValveCv",
      label: "Required zone valve cv",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedZoneDesignFlowsGpm:
        value.observedZoneDesignFlowsGpm as readonly number[],
      callerTargetValveDropsPsi:
        value.callerTargetValveDropsPsi as readonly number[],
      callerMatchedFluidSpecificGravity:
        value.callerMatchedFluidSpecificGravity as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
