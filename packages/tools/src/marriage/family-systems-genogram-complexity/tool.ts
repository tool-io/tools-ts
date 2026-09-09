import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  unique,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualGenogramNodeIds: readonly string[];
  readonly actualIndependentlyAnnotatedEdgeEndpointIndices: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualGenogramNodeIds",
    label: "Actual genogram node ids",
    kind: "stringList",
  },
  {
    id: "actualIndependentlyAnnotatedEdgeEndpointIndices",
    label: "Actual independently annotated edge endpoint indices",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.actualGenogramNodeIds, "persons");
  const n = input.actualGenogramNodeIds.length;
  if (n < 2) simpleError("persons", "At least two actual identified persons.");
  const keys = new Set<string>();
  for (const r of input.actualIndependentlyAnnotatedEdgeEndpointIndices) {
    if (r.length !== 2) simpleError("edge", "Actual nodeindexpair.");
    r.forEach((v) => bounded(v, "nodeindex", 0, n - 1));
    const key = [...r].sort((a, b) => a - b).join(":");
    if (r[0] === r[1] || keys.has(key))
      simpleError("edge", "No loops or duplicatedundirected relationships.");
    keys.add(key);
  }
  return {
    observedIdentifiedPersonCount: n,
    observedUniqueUndirectedRelationCount:
      input.actualIndependentlyAnnotatedEdgeEndpointIndices.length,
    conditionalSimpleGraphDensity:
      (2 * input.actualIndependentlyAnnotatedEdgeEndpointIndices.length) /
      (n * (n - 1)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualGenogramNodeIds: ["a", "b", "c"],
    actualIndependentlyAnnotatedEdgeEndpointIndices: [
      [0, 1],
      [1, 2],
    ],
  },
  output: {
    result: {
      observedIdentifiedPersonCount: 3,
      observedUniqueUndirectedRelationCount: 2,
      conditionalSimpleGraphDensity: 0.6666666666666666,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/family-systems-genogram-complexity",
  title: "Family Systems Genogram Complexity Calculator",
  description:
    "Actual independently annotated simple undirected genogram graph nodes/unique edges, density 2E/N(N\u22121). Not family dysfunction, psychological complexity diagnosis, directed parentage semantics or confidential identity inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
