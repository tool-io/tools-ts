import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../shared.js";
export type Input = Readonly<{ readonly temperaturesC: readonly number[] }>;
export type Output = Readonly<{
  readonly freshwaterDensitiesKgPerM3: readonly number[];
}>;
const inputFields = [
  { id: "temperaturesC", label: "Temperatures c", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.temperaturesC.length ||
    input.temperaturesC.some((t) => t < 0 || t > 40)
  )
    simpleError(
      "temperaturesC",
      "Freshwater model temperatures from 0 to 40°C required.",
    );
  return {
    freshwaterDensitiesKgPerM3: input.temperaturesC.map(
      (t) =>
        1000 *
        (1 -
          ((t + 288.9414) / (508929.2 * (t + 68.12963))) * (t - 3.9863) ** 2),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { temperaturesC: [0, 4] } satisfies Input;
export const exampleOutput = {
  freshwaterDensitiesKgPerM3: [999.8675791619049, 999.9999985022105],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/freshwater-density-from-temperature",
  title: "Freshwater Density From Temperature",
  description:
    "Evaluate the standard empirical pure-freshwater density approximation near atmospheric pressure for 0–40°C; excludes salinity, compression and dissolved-solids effects.",
  inputs: inputFields,
  outputs: [
    {
      id: "freshwaterDensitiesKgPerM3",
      label: "Freshwater densities kg per m3",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({ temperaturesC: value.temperaturesC as readonly number[] }),
});
export const run = tool.execute;
export default tool;
