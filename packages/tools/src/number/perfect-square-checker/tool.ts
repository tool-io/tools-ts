import { createSimpleTool } from "../../core/simple.js";
export const perfectSquareCheckerTool = createSimpleTool({
  id: "number/perfect-square-checker",
  title: "Perfect Square Checker",
  description:
    "Check whether a nonnegative safe integer is an exact integer square.",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 0 }],
  outputs: [
    { id: "perfectSquare", label: "Perfect square", kind: "boolean" },
    { id: "root", label: "Integer square root", kind: "integer" },
  ],
  calculate: (input) => {
    const root = Math.floor(Math.sqrt(input.value as number));
    return { perfectSquare: root * root === input.value, root };
  },
});
export const runPerfectSquareChecker = perfectSquareCheckerTool.execute;
export default perfectSquareCheckerTool;
