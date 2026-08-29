import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { minHashComparison } from "../hash-sketch.js";

export const example = {
  input: { left: ["a", "b"], right: ["b", "c"], hashCount: 32 },
  output: {
    estimatedJaccard: 0.375,
    exactJaccard: 0.3333333333333333,
    leftSignature: [
      1185767313, 1185767313, 444641715, 2111704691, 1377171301, 1377171301,
      2111704691, 1311273838, 1358841603, 1358841603, 1311273838, 250914211,
      2249599777, 2249599777, 250914211, 590027118, 550558746, 550558746,
      590027118, 910896560, 1701362178, 1701362178, 910896560, 228143771,
      794621484, 794621484, 228143771, 2437239260, 169220629, 169220629,
      2437239260, 1294499476,
    ],
    rightSignature: [
      1185767313, 444641715, 444641715, 1377171301, 1377171301, 2111704691,
      2111704691, 2144823071, 2144823071, 1311273838, 1311273838, 1911777871,
      1911777871, 250914211, 250914211, 550558746, 550558746, 1560842042,
      1560842042, 1701362178, 1701362178, 910896560, 910896560, 228143771,
      228143771, 794621484, 794621484, 2693131916, 2693131916, 169220629,
      169220629, 2416073818,
    ],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "data-structure/minhash",
  title: "MinHash Jaccard Similarity Estimator",
  description:
    "Compare two sets of strings using seeded 32-bit MinHash signatures. Estimated Jaccard can differ from exact Jaccard, especially with few hashes.",
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
  ],
  outputs: [
    { id: "estimatedJaccard", kind: "number", label: "estimated Jaccard" },
    { id: "exactJaccard", kind: "number", label: "exact Jaccard" },
    { id: "leftSignature", kind: "numberList", label: "left Signature" },
    { id: "rightSignature", kind: "numberList", label: "right Signature" },
  ],
  calculate: (input) =>
    minHashComparison(
      input.left as string[],
      input.right as string[],
      input.hashCount as number,
    ),
});
export type MinhashInput = Readonly<typeof example.input>;
export type MinhashOutput = Readonly<typeof example.output>;
export const minhashTool = tool;
export const runMinhash = tool.execute;
export default tool;
