import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly branchLengths: readonly number[];
  readonly includedPath: readonly boolean[];
};
export type Output = {
  readonly pathDistance: number;
  readonly omittedLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    branchLengths: { type: "array", maxItems: 256, items: { type: "number" } },
    includedPath: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["branchLengths", "includedPath"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pathDistance: { type: "number" },
    omittedLength: { type: "number" },
  },
  required: ["pathDistance", "omittedLength"],
} as const;
/** Sum a supplied phylogenetic path selection without inferring a tree, topology or molecular clock. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { branchLengths, includedPath } = request;
  const compute = (): Output => {
    H.sameLength(branchLengths, includedPath);
    H.domain(branchLengths.every((x) => x >= 0));
    return {
      pathDistance: branchLengths.reduce(
        (a, b, i) => a + (includedPath[i] ? b : 0),
        0,
      ),
      omittedLength: branchLengths.reduce(
        (a, b, i) => a + (includedPath[i] ? 0 : b),
        0,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { branchLengths: [0.2, 0.3, 0.5], includedPath: [true, false, true] },
  output: { pathDistance: 0.7, omittedLength: 0.3 },
} satisfies ToolExample<Input, Output>;
export const branchLengthTipDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/branch-length-tip-distance",
    title: "Branch Length Tip Distance Tool",
    description:
      "Sum a supplied phylogenetic path selection without inferring a tree, topology or molecular clock.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        branchLengths: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        includedPath: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["branchLengths", "includedPath"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pathDistance: { type: "number" },
        omittedLength: { type: "number" },
      },
      required: ["pathDistance", "omittedLength"],
    },
    ports: {
      inputs: [
        {
          id: "branchLengths",
          label: "Branch Lengths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "includedPath",
          label: "Included Path",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "pathDistance",
          label: "Path Distance",
          valueType: { type: "number" },
        },
        {
          id: "omittedLength",
          label: "Omitted Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = branchLengthTipDistanceTool.execute;
export default branchLengthTipDistanceTool;
