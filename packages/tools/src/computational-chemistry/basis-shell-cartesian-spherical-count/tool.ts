import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ angularMomentum: number; convention: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "angularMomentum", label: "Angular momentum", kind: "integer" },
  {
    id: "convention",
    label: "Convention",
    kind: "string",
    enum: ["cartesian", "spherical"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.angularMomentum, 0, 32);
  H.choice(i.convention, ["cartesian", "spherical"]);
  return H.finish({
    functionCount:
      i.convention === "cartesian"
        ? ((i.angularMomentum + 1) * (i.angularMomentum + 2)) / 2
        : 2 * i.angularMomentum + 1,
  });
};
export const example = {
  input: { angularMomentum: 2, convention: "cartesian" },
  output: { result: { functionCount: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "computational-chemistry/basis-shell-cartesian-spherical-count",
  title: "Computational Chemistry: Basis Shell Cartesian Spherical Count Tool",
  description:
    "Count Cartesian or real spherical Gaussian basis functions for one explicit angular-momentum shell, without contractions, spin doubling or a molecular basis inventory.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { functionCount: { type: "number" } },
        required: ["functionCount"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
