import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  unique,
  matrixFlags,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly stationIds: readonly string[];
  readonly directedAudioRouteFlags: readonly (readonly number[])[];
  readonly callerRootStationId: string;
}>;
export type Output = Readonly<{
  readonly rootReachableStationIds: readonly string[];
  readonly unreachableStationIds: readonly string[];
  readonly rootHasFeedbackCycle: boolean;
}>;
const inputFields = [
  { id: "stationIds", label: "Station ids", kind: "stringList" },
  {
    id: "directedAudioRouteFlags",
    label: "Directed audio route flags",
    kind: "matrix",
  },
  {
    id: "callerRootStationId",
    label: "Caller root station id",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.stationIds, "stations");
  matrixFlags(input.directedAudioRouteFlags, input.stationIds.length);
  if (input.directedAudioRouteFlags.length !== input.stationIds.length)
    simpleError("routes", "Square station route graph required.");
  const root = input.stationIds.indexOf(input.callerRootStationId);
  if (root < 0) simpleError("root", "Caller root must exist.");
  const seen = new Set<number>([root]),
    queue = [root];
  let feedback = false;
  for (let q = 0; q < queue.length; q++)
    input.directedAudioRouteFlags[queue[q]].forEach((v, j) => {
      if (v) {
        if (j === root) feedback = true;
        if (!seen.has(j)) {
          seen.add(j);
          queue.push(j);
        }
      }
    });
  return {
    rootReachableStationIds: input.stationIds.filter((_, i) => seen.has(i)),
    unreachableStationIds: input.stationIds.filter((_, i) => !seen.has(i)),
    rootHasFeedbackCycle: feedback,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stationIds: ["SM", "A", "B"],
  directedAudioRouteFlags: [
    [0, 1, 0],
    [0, 0, 1],
    [0, 0, 0],
  ],
  callerRootStationId: "SM",
} satisfies Input;
export const exampleOutput = {
  rootReachableStationIds: ["SM", "A", "B"],
  unreachableStationIds: [],
  rootHasFeedbackCycle: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/ifb-comms-beltpack-channel-tree-lookup",
  title: "IFB Comms Beltpack Channel Tree Lookup",
  description:
    "Audit actual directed IFB/comms routing graph from explicit caller root with reachability and return-to-root feedback witness; not audio feedback stability, hardware wiring or a universal station tree.",
  inputs: inputFields,
  outputs: [
    {
      id: "rootReachableStationIds",
      label: "Root reachable station ids",
      kind: "stringList",
    },
    {
      id: "unreachableStationIds",
      label: "Unreachable station ids",
      kind: "stringList",
    },
    {
      id: "rootHasFeedbackCycle",
      label: "Root has feedback cycle",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      stationIds: value.stationIds as readonly string[],
      directedAudioRouteFlags:
        value.directedAudioRouteFlags as readonly (readonly number[])[],
      callerRootStationId: value.callerRootStationId as string,
    }),
});
export const run = tool.execute;
export default tool;
