import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  positive,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly firstPaintParts: number;
  readonly secondPaintParts: number;
  readonly totalBatchVolumeMl: number;
  readonly callerComponentVolumeAdditivityAssumed: boolean;
}>;
export type Output = Readonly<{
  readonly firstComponentVolumeMl: number;
  readonly secondComponentVolumeMl: number;
}>;
const inputFields = [
  { id: "firstPaintParts", label: "First paint parts", kind: "number" },
  { id: "secondPaintParts", label: "Second paint parts", kind: "number" },
  { id: "totalBatchVolumeMl", label: "Total batch volume ml", kind: "number" },
  {
    id: "callerComponentVolumeAdditivityAssumed",
    label: "Caller component volume additivity assumed",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.firstPaintParts, "firstPaintParts");
  nonnegative(input.secondPaintParts, "secondPaintParts");
  nonnegative(input.totalBatchVolumeMl, "totalBatchVolumeMl");
  if (!input.callerComponentVolumeAdditivityAssumed)
    simpleError(
      "model",
      "Explicit volume-additivity assumption required; mass ratios/densities are another model.",
    );
  const total = positive(
      input.firstPaintParts + input.secondPaintParts,
      "parts",
    ),
    a = input.totalBatchVolumeMl * (input.firstPaintParts / total);
  return {
    firstComponentVolumeMl: a,
    secondComponentVolumeMl: input.totalBatchVolumeMl - a,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstPaintParts: 1,
  secondPaintParts: 3,
  totalBatchVolumeMl: 200,
  callerComponentVolumeAdditivityAssumed: true,
} satisfies Input;
export const exampleOutput = {
  firstComponentVolumeMl: 50,
  secondComponentVolumeMl: 150,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/paint-parts-mix-ratio-two-colors",
  title: "Paint Parts Mix Ratio Two Colors",
  description:
    "Scale caller paint volumetric parts to an additive-volume batch; not RGB pigment mixing, mass fractions without densities or a guarantee of finished color/volume when contraction occurs.",
  inputs: inputFields,
  outputs: [
    {
      id: "firstComponentVolumeMl",
      label: "First component volume ml",
      kind: "number",
    },
    {
      id: "secondComponentVolumeMl",
      label: "Second component volume ml",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstPaintParts: value.firstPaintParts as number,
      secondPaintParts: value.secondPaintParts as number,
      totalBatchVolumeMl: value.totalBatchVolumeMl as number,
      callerComponentVolumeAdditivityAssumed:
        value.callerComponentVolumeAdditivityAssumed as boolean,
    }),
});
export const run = tool.execute;
export default tool;
