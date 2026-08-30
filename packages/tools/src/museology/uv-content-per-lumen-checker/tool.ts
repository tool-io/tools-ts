import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly uvIrradianceMicrowattsPerM2: readonly number[];
  readonly matchedIlluminanceLux: readonly number[];
  readonly callerUvContentLimitMicrowattsPerLumen: number;
}>;
export type Output = Readonly<{
  readonly uvContentMicrowattsPerLumen: readonly number[];
  readonly aboveCallerUvContentFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "uvIrradianceMicrowattsPerM2",
    label: "Uv irradiance microwatts per m2",
    kind: "numberList",
  },
  {
    id: "matchedIlluminanceLux",
    label: "Matched illuminance lux",
    kind: "numberList",
  },
  {
    id: "callerUvContentLimitMicrowattsPerLumen",
    label: "Caller uv content limit microwatts per lumen",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.matchedIlluminanceLux.forEach((v) =>
    positive(v, "matchedIlluminanceLux"),
  );
  input.uvIrradianceMicrowattsPerM2.forEach((v) =>
    nonnegative(v, "uvIrradianceMicrowattsPerM2"),
  );
  nonnegative(
    input.callerUvContentLimitMicrowattsPerLumen,
    "callerUvContentLimitMicrowattsPerLumen",
  );
  aligned(
    input.uvIrradianceMicrowattsPerM2,
    input.matchedIlluminanceLux,
    "uvIrradianceMicrowattsPerM2",
  );
  const v = input.uvIrradianceMicrowattsPerM2.map(
    (x, i) => x / input.matchedIlluminanceLux[i],
  );
  return {
    uvContentMicrowattsPerLumen: v,
    aboveCallerUvContentFlags: v.map((x) =>
      x > input.callerUvContentLimitMicrowattsPerLumen ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  uvIrradianceMicrowattsPerM2: [1000, 0],
  matchedIlluminanceLux: [100, 50],
  callerUvContentLimitMicrowattsPerLumen: 5,
} satisfies Input;
export const exampleOutput = {
  uvContentMicrowattsPerLumen: [10, 0],
  aboveCallerUvContentFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/uv-content-per-lumen-checker",
  title: "UV Content Microwatts per Lumen Checker",
  description:
    "Audit measured UV irradiance divided by matched illuminance under caller content limit; zero illuminance leaves the ratio undefined, not a safe material classification.",
  inputs: inputFields,
  outputs: [
    {
      id: "uvContentMicrowattsPerLumen",
      label: "Uv content microwatts per lumen",
      kind: "numberList",
    },
    {
      id: "aboveCallerUvContentFlags",
      label: "Above caller uv content flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      uvIrradianceMicrowattsPerM2:
        value.uvIrradianceMicrowattsPerM2 as readonly number[],
      matchedIlluminanceLux: value.matchedIlluminanceLux as readonly number[],
      callerUvContentLimitMicrowattsPerLumen:
        value.callerUvContentLimitMicrowattsPerLumen as number,
    }),
});
export const run = tool.execute;
export default tool;
