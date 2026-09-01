import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly floorToCeilingHeightsM: readonly number[];
  readonly overheadObstructionDropsM: readonly number[];
  readonly callerRequiredHeadroomM: number;
}>;
export type Output = Readonly<{
  readonly observedClearHeadroomsM: readonly number[];
  readonly stationsBelowCallerHeadroom: readonly number[];
}>;
const inputFields = [
  {
    id: "floorToCeilingHeightsM",
    label: "Floor to ceiling heights m",
    kind: "numberList",
  },
  {
    id: "overheadObstructionDropsM",
    label: "Overhead obstruction drops m",
    kind: "numberList",
  },
  {
    id: "callerRequiredHeadroomM",
    label: "Caller required headroom m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.floorToCeilingHeightsM.forEach((v) =>
    positive(v, "floorToCeilingHeightsM"),
  );
  positive(input.callerRequiredHeadroomM, "callerRequiredHeadroomM");
  input.overheadObstructionDropsM.forEach((v) =>
    nonnegative(v, "overheadObstructionDropsM"),
  );
  aligned(
    input.floorToCeilingHeightsM,
    input.overheadObstructionDropsM,
    "floorToCeilingHeightsM",
  );
  const clear = input.floorToCeilingHeightsM.map(
    (v, i) => v - input.overheadObstructionDropsM[i],
  );
  return {
    observedClearHeadroomsM: clear,
    stationsBelowCallerHeadroom: clear.flatMap((v, i) =>
      v < input.callerRequiredHeadroomM ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  floorToCeilingHeightsM: [3, 2.5],
  overheadObstructionDropsM: [0.5, 1],
  callerRequiredHeadroomM: 2,
} satisfies Input;
export const exampleOutput = {
  observedClearHeadroomsM: [2.5, 1.5],
  stationsBelowCallerHeadroom: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/trap-room-headroom-checker",
  title: "Trap Room Headroom Checker",
  description:
    "Audit actual trap-room ceiling minus measured obstruction drops with signed headroom deficits; not working-at-height, access or code certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedClearHeadroomsM",
      label: "Observed clear headrooms m",
      kind: "numberList",
    },
    {
      id: "stationsBelowCallerHeadroom",
      label: "Stations below caller headroom",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      floorToCeilingHeightsM: value.floorToCeilingHeightsM as readonly number[],
      overheadObstructionDropsM:
        value.overheadObstructionDropsM as readonly number[],
      callerRequiredHeadroomM: value.callerRequiredHeadroomM as number,
    }),
});
export const run = tool.execute;
export default tool;
