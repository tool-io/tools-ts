import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  graph,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedDirectedAdjacency: readonly (readonly number[])[];
  readonly callerSeedRoleIds: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedDirectedAdjacency",
    label: "Observed directed adjacency",
    kind: "matrix",
  },
  {
    id: "callerSeedRoleIds",
    label: "Caller seed role ids",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const n = graph(input.observedDirectedAdjacency, true);
  aligned(input.observedDirectedAdjacency, input.callerSeedRoleIds, "seeds");
  input.callerSeedRoleIds.forEach((v) => bounded(v, "seed", 0, 31));
  let roles = [...input.callerSeedRoleIds];
  for (let k = 0; k < n; k++) {
    const sig = roles.map((r, i) =>
        JSON.stringify([
          r,
          [
            ...new Set(
              roles.filter((_, j) => input.observedDirectedAdjacency[i][j]),
            ),
          ].sort((a, b) => a - b),
          [
            ...new Set(
              roles.filter((_, j) => input.observedDirectedAdjacency[j][i]),
            ),
          ].sort((a, b) => a - b),
        ]),
      ),
      keys = [...new Set(sig)],
      next = sig.map((v) => keys.indexOf(v));
    const same = roles.every((_, i) =>
      roles.every((_, j) => (roles[i] === roles[j]) === (next[i] === next[j])),
    );
    roles = next;
    if (same) break;
  }
  return { refinedRoleIds: roles, refinedRoleCount: new Set(roles).size };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedDirectedAdjacency: [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ],
    callerSeedRoleIds: [0, 0, 1],
  },
  output: { result: { refinedRoleIds: [0, 1, 2], refinedRoleCount: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/regular-equivalence-role-assigner",
  title: "Regular Equivalence Role Assigner Tool",
  description:
    "Compute coarsest seed-refining directed regular-role partition by distinct outgoing/incoming neighbor-role sets, not neighbor counts. Bounded finite refinement, deterministic first-node labels; not unconstrained latent social-role or structural-equivalence inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
