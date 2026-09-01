import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  unique,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly fixtureIds: readonly string[];
  readonly fixtureFootprintsChannels: readonly number[];
  readonly firstUniverse: number;
  readonly firstAddress: number;
  readonly callerMaximumUniverse: number;
}>;
export type Output = Readonly<{
  readonly assignedUniverses: readonly number[];
  readonly assignedStartAddresses: readonly number[];
  readonly assignedEndAddresses: readonly number[];
  readonly unusedTailChannelsBeforeUniverseChanges: number;
}>;
const inputFields = [
  { id: "fixtureIds", label: "Fixture ids", kind: "stringList" },
  {
    id: "fixtureFootprintsChannels",
    label: "Fixture footprints channels",
    kind: "numberList",
  },
  { id: "firstUniverse", label: "First universe", kind: "number" },
  { id: "firstAddress", label: "First address", kind: "number" },
  {
    id: "callerMaximumUniverse",
    label: "Caller maximum universe",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.fixtureIds, "fixtures");
  aligned(input.fixtureIds, input.fixtureFootprintsChannels, "fixtures");
  bounded(input.firstUniverse, "universe", 1, 63999);
  bounded(
    input.callerMaximumUniverse,
    "maximumUniverse",
    input.firstUniverse,
    63999,
  );
  bounded(input.firstAddress, "address", 1, 512);
  let universe = input.firstUniverse,
    address = input.firstAddress,
    tail = 0;
  const universes: number[] = [],
    starts: number[] = [],
    ends: number[] = [];
  input.fixtureFootprintsChannels.forEach((v) => {
    bounded(v, "footprint", 1, 512);
    if (address + v - 1 > 512) {
      tail += 513 - address;
      universe++;
      address = 1;
    }
    if (universe > input.callerMaximumUniverse)
      simpleError(
        "capacity",
        "Contiguous fixture patch exceeds caller universe budget.",
      );
    universes.push(universe);
    starts.push(address);
    ends.push(address + v - 1);
    address += v;
  });
  return {
    assignedUniverses: universes,
    assignedStartAddresses: starts,
    assignedEndAddresses: ends,
    unusedTailChannelsBeforeUniverseChanges: tail,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fixtureIds: ["a", "b", "c"],
  fixtureFootprintsChannels: [300, 300, 20],
  firstUniverse: 1,
  firstAddress: 1,
  callerMaximumUniverse: 2,
} satisfies Input;
export const exampleOutput = {
  assignedUniverses: [1, 2, 2],
  assignedStartAddresses: [1, 1, 301],
  assignedEndAddresses: [300, 300, 320],
  unusedTailChannelsBeforeUniverseChanges: 212,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/dmx-universe-channel-address-planner",
  title: "DMX Universe Channel Address Planner Tool",
  description:
    "Plan actual contiguous DMX fixture footprints without crossing 512-channel universe boundaries, honoring start address/universe budget; not generic pixel-map capacity, reserved-address reconciliation, fixture personality inference or hardware patch write.",
  inputs: inputFields,
  outputs: [
    {
      id: "assignedUniverses",
      label: "Assigned universes",
      kind: "numberList",
    },
    {
      id: "assignedStartAddresses",
      label: "Assigned start addresses",
      kind: "numberList",
    },
    {
      id: "assignedEndAddresses",
      label: "Assigned end addresses",
      kind: "numberList",
    },
    {
      id: "unusedTailChannelsBeforeUniverseChanges",
      label: "Unused tail channels before universe changes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      fixtureIds: value.fixtureIds as readonly string[],
      fixtureFootprintsChannels:
        value.fixtureFootprintsChannels as readonly number[],
      firstUniverse: value.firstUniverse as number,
      firstAddress: value.firstAddress as number,
      callerMaximumUniverse: value.callerMaximumUniverse as number,
    }),
});
export const run = tool.execute;
export default tool;
