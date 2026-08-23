import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HexagonalCheckerInput = {
  readonly value: number;
};

export type HexagonalCheckerOutput = {
  readonly isHexagonal: boolean;
};

export const hexagonalCheckerExample = {
  input: { value: 15 },
  output: { isHexagonal: true },
} satisfies ToolExample<HexagonalCheckerInput, HexagonalCheckerOutput>;

export const calculateHexagonalChecker = (
  input: HexagonalCheckerInput,
): HexagonalCheckerOutput => {
  const discriminant = 8n * BigInt(input.value) + 1n;
  let root = BigInt(Math.floor(Math.sqrt(Number(discriminant))));
  while ((root + 1n) * (root + 1n) <= discriminant) root += 1n;
  while (root * root > discriminant) root -= 1n;
  return { isHexagonal: root * root === discriminant && root % 4n === 3n };
};

export const hexagonalCheckerTool = createSimpleTool({
  id: "number/hexagonal-checker",
  title: "Hexagonal Number Checker",
  description:
    "Check whether a nonnegative integer is a hexagonal number k(2k-1).",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 0 }],
  outputs: [
    { id: "isHexagonal", label: "Is a hexagonal number", kind: "boolean" },
  ],
  calculate: (input) =>
    calculateHexagonalChecker({ value: input.value as number }),
});
export const runHexagonalChecker = hexagonalCheckerTool.execute;
export default hexagonalCheckerTool;
