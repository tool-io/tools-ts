import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly interiorBinDimensionsM: readonly number[];
  readonly callerMaximumFillHeightM: number;
  readonly measuredLooseGrapeBulkDensityKgPerM3: number;
  readonly declaredGrossBinMassLimitKg: number;
  readonly emptyBinTareKg: number;
}>;
export type Output = Readonly<{
  readonly geometricGrapeFillVolumeM3: number;
  readonly densityModelPayloadKg: number;
  readonly declaredMassLimitedPayloadKg: number;
  readonly volumeRequiredAtDeclaredPayloadLimitM3: number;
}>;
const inputFields = [
  {
    id: "interiorBinDimensionsM",
    label: "Interior bin dimensions m",
    kind: "numberList",
  },
  {
    id: "callerMaximumFillHeightM",
    label: "Caller maximum fill height m",
    kind: "number",
  },
  {
    id: "measuredLooseGrapeBulkDensityKgPerM3",
    label: "Measured loose grape bulk density kg per m3",
    kind: "number",
  },
  {
    id: "declaredGrossBinMassLimitKg",
    label: "Declared gross bin mass limit kg",
    kind: "number",
  },
  { id: "emptyBinTareKg", label: "Empty bin tare kg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.interiorBinDimensionsM.forEach((v) =>
    positive(v, "interiorBinDimensionsM"),
  );
  positive(
    input.measuredLooseGrapeBulkDensityKgPerM3,
    "measuredLooseGrapeBulkDensityKgPerM3",
  );
  nonnegative(input.callerMaximumFillHeightM, "callerMaximumFillHeightM");
  nonnegative(input.declaredGrossBinMassLimitKg, "declaredGrossBinMassLimitKg");
  nonnegative(input.emptyBinTareKg, "emptyBinTareKg");
  if (
    input.interiorBinDimensionsM.length !== 3 ||
    input.callerMaximumFillHeightM > input.interiorBinDimensionsM[2]
  )
    simpleError(
      "fill",
      "Three interior dimensions and caller fill height within bin required.",
    );
  const geometricGrapeFillVolumeM3 =
      input.interiorBinDimensionsM[0] *
      input.interiorBinDimensionsM[1] *
      input.callerMaximumFillHeightM,
    densityModelPayloadKg =
      geometricGrapeFillVolumeM3 * input.measuredLooseGrapeBulkDensityKgPerM3,
    declaredMassLimitedPayloadKg = Math.min(
      densityModelPayloadKg,
      nonnegative(
        input.declaredGrossBinMassLimitKg - input.emptyBinTareKg,
        "tare",
      ),
    );
  return {
    geometricGrapeFillVolumeM3,
    densityModelPayloadKg,
    declaredMassLimitedPayloadKg,
    volumeRequiredAtDeclaredPayloadLimitM3:
      declaredMassLimitedPayloadKg / input.measuredLooseGrapeBulkDensityKgPerM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  interiorBinDimensionsM: [1, 2, 0.5],
  callerMaximumFillHeightM: 0.4,
  measuredLooseGrapeBulkDensityKgPerM3: 400,
  declaredGrossBinMassLimitKg: 300,
  emptyBinTareKg: 20,
} satisfies Input;
export const exampleOutput = {
  geometricGrapeFillVolumeM3: 0.8,
  densityModelPayloadKg: 320,
  declaredMassLimitedPayloadKg: 280,
  volumeRequiredAtDeclaredPayloadLimitM3: 0.7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/grape-bin-fill-weight-capacity",
  title: "Grape Bin Fill Weight Capacity",
  description:
    "Compare measured bin geometry/loose bulk density against caller already-established gross mass limit minus tare; no structure/forklift capacity approval and compressibility/dynamic loads excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "geometricGrapeFillVolumeM3",
      label: "Geometric grape fill volume m3",
      kind: "number",
    },
    {
      id: "densityModelPayloadKg",
      label: "Density model payload kg",
      kind: "number",
    },
    {
      id: "declaredMassLimitedPayloadKg",
      label: "Declared mass limited payload kg",
      kind: "number",
    },
    {
      id: "volumeRequiredAtDeclaredPayloadLimitM3",
      label: "Volume required at declared payload limit m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      interiorBinDimensionsM: value.interiorBinDimensionsM as readonly number[],
      callerMaximumFillHeightM: value.callerMaximumFillHeightM as number,
      measuredLooseGrapeBulkDensityKgPerM3:
        value.measuredLooseGrapeBulkDensityKgPerM3 as number,
      declaredGrossBinMassLimitKg: value.declaredGrossBinMassLimitKg as number,
      emptyBinTareKg: value.emptyBinTareKg as number,
    }),
});
export const run = tool.execute;
export default tool;
