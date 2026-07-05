import { createSimpleTool, simpleError } from "../../core/simple.js";
export const leastCommonMultipleTool = createSimpleTool({
  id: "number/least-common-multiple",
  title: "Least Common Multiple Calculator",
  description:
    "Calculate the nonnegative least common multiple of two safe integers.",
  inputs: [
    { id: "first", label: "First integer", kind: "integer" },
    { id: "second", label: "Second integer", kind: "integer" },
  ],
  outputs: [
    {
      id: "leastCommonMultiple",
      label: "Least common multiple",
      kind: "integer",
    },
  ],
  calculate: (input) => {
    const first = input.first as number;
    const second = input.second as number;
    if (first === 0 || second === 0) return { leastCommonMultiple: 0 };
    let a = Math.abs(first);
    let b = Math.abs(second);
    while (b !== 0) [a, b] = [b, a % b];
    const result = Math.abs((first / a) * second);
    if (!Number.isSafeInteger(result))
      simpleError(
        "first",
        "The least common multiple exceeds the safe integer range.",
      );
    return { leastCommonMultiple: result };
  },
});
export const runLeastCommonMultiple = leastCommonMultipleTool.execute;
export default leastCommonMultipleTool;
