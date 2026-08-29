import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { localitySensitiveHash } from "../hash-sketch.js";

export const example = {
  input: { left: ["a", "b"], right: ["b", "c"], hashCount: 32, bandCount: 8 },
  output: { candidate: false, matchingBands: [] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "data-structure/locality-sensitive-hash",
  title: "Locality-Sensitive Hash Candidate Checker",
  description:
    "Use banded MinHash signatures to flag a pair of string sets as a similarity candidate. A matching band is not proof of semantic similarity.",
  inputs: [
    { id: "left", kind: "stringList", label: "left" },
    { id: "right", kind: "stringList", label: "right" },
    {
      id: "hashCount",
      kind: "integer",
      label: "hash Count",
      minimum: 1,
      maximum: 256,
    },
    {
      id: "bandCount",
      kind: "integer",
      label: "band Count",
      minimum: 1,
      maximum: 256,
    },
  ],
  outputs: [
    { id: "candidate", kind: "boolean", label: "candidate" },
    { id: "matchingBands", kind: "numberList", label: "matching Bands" },
  ],
  calculate: (input) =>
    localitySensitiveHash(
      input.left as string[],
      input.right as string[],
      input.hashCount as number,
      input.bandCount as number,
    ),
});
export type LocalitySensitiveHashInput = Readonly<typeof example.input>;
export type LocalitySensitiveHashOutput = Readonly<typeof example.output>;
export const localitySensitiveHashTool = tool;
export const runLocalitySensitiveHash = tool.execute;
export default tool;
