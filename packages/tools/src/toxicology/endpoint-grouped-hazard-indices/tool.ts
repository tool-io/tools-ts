import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly hazardQuotients: readonly number[];
  readonly endpointGroupIds: readonly number[];
}>;
export type Output = Readonly<{
  readonly uniqueEndpointGroups: readonly number[];
  readonly groupHazardIndices: readonly number[];
  readonly aboveUnitFlags: readonly number[];
}>;
const inputFields = [
  { id: "hazardQuotients", label: "Hazard quotients", kind: "numberList" },
  { id: "endpointGroupIds", label: "Endpoint group ids", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.hazardQuotients, input.endpointGroupIds, "hazardQuotients");
  input.hazardQuotients.forEach((v) => nonnegative(v, "hazardQuotients"));
  input.endpointGroupIds.forEach((v) => count(v, "endpointGroupIds"));
  const uniqueEndpointGroups = [...new Set(input.endpointGroupIds)].sort(
      (a, b) => a - b,
    ),
    groupHazardIndices = uniqueEndpointGroups.map((group) =>
      input.hazardQuotients.reduce(
        (s, v, i) => s + (input.endpointGroupIds[i] === group ? v : 0),
        0,
      ),
    );
  return {
    uniqueEndpointGroups,
    groupHazardIndices,
    aboveUnitFlags: groupHazardIndices.map((v) => (v > 1 ? 1 : 0)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  hazardQuotients: [0.5, 0.7, 0.2],
  endpointGroupIds: [1, 1, 2],
} satisfies Input;
export const exampleOutput = {
  uniqueEndpointGroups: [1, 2],
  groupHazardIndices: [1.2, 0.2],
  aboveUnitFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/endpoint-grouped-hazard-indices",
  title: "Hazard Index",
  description:
    "Sum compatible hazard quotients within caller-assigned common endpoint groups instead of indiscriminately summing unrelated toxic endpoints; additivity is an assumption.",
  inputs: inputFields,
  outputs: [
    {
      id: "uniqueEndpointGroups",
      label: "Unique endpoint groups",
      kind: "numberList",
    },
    {
      id: "groupHazardIndices",
      label: "Group hazard indices",
      kind: "numberList",
    },
    { id: "aboveUnitFlags", label: "Above unit flags", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      hazardQuotients: value.hazardQuotients as readonly number[],
      endpointGroupIds: value.endpointGroupIds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
