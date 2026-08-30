import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, endpoints } from "../shared.js";

export type Input = Readonly<{
  readonly concentrations: readonly number[];
  readonly recoveryCfu: readonly number[];
  readonly maximumAllowedRecoveryCfu: number;
}>;
export type Output = Readonly<{
  readonly mbecConcentration: number;
  readonly endpointFound: boolean;
  readonly rightCensored: boolean;
}>;
export const calculate = (input: Input): Output => {
  endpoints(input.concentrations, input.recoveryCfu, "concentrations");
  input.recoveryCfu.forEach((v) => count(v, "recoveryCfu"));
  count(input.maximumAllowedRecoveryCfu, "maximumAllowedRecoveryCfu");
  if (input.recoveryCfu.some((v, i) => i > 0 && v > input.recoveryCfu[i - 1]))
    simpleError(
      "recoveryCfu",
      "Recovery counts must be nonincreasing over dose for an unambiguous endpoint.",
    );
  const index = input.recoveryCfu.findIndex(
    (v) => v <= input.maximumAllowedRecoveryCfu,
  );
  return {
    mbecConcentration: index < 0 ? 0 : input.concentrations[index],
    endpointFound: index >= 0,
    rightCensored: index < 0,
  };
};
export const exampleInput = {
  concentrations: [1, 2, 4],
  recoveryCfu: [100, 10, 0],
  maximumAllowedRecoveryCfu: 0,
} satisfies Input;
export const exampleOutput = {
  mbecConcentration: 4,
  endpointFound: true,
  rightCensored: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/biofilm-eradication-endpoint",
  title: "Biofilm Eradication Endpoint",
  description:
    "Find the lowest observed biofilm exposure concentration meeting a supplied post-exposure recovery criterion; units and protocol must be consistent.",
  inputs: [
    { id: "concentrations", label: "Concentrations", kind: "numberList" },
    { id: "recoveryCfu", label: "Recovery cfu", kind: "numberList" },
    {
      id: "maximumAllowedRecoveryCfu",
      label: "Maximum allowed recovery cfu",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "mbecConcentration", label: "Mbec concentration", kind: "number" },
    { id: "endpointFound", label: "Endpoint found", kind: "boolean" },
    { id: "rightCensored", label: "Right censored", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      concentrations: value.concentrations as readonly number[],
      recoveryCfu: value.recoveryCfu as readonly number[],
      maximumAllowedRecoveryCfu: value.maximumAllowedRecoveryCfu as number,
    }),
});
export const run = tool.execute;
export default tool;
