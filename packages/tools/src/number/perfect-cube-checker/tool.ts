import { createSimpleTool } from "../../core/simple.js";
export const perfectCubeCheckerTool = createSimpleTool({
  id: "number/perfect-cube-checker",
  title: "Perfect Cube Checker",
  description: "Check whether a safe integer is an exact integer cube.",
  inputs: [{ id: "value", label: "Integer", kind: "integer" }],
  outputs: [
    { id: "perfectCube", label: "Perfect cube", kind: "boolean" },
    { id: "root", label: "Nearest cube root", kind: "integer" },
  ],
  calculate: (input) => {
    const value = input.value as number;
    const root = Math.round(Math.cbrt(value));
    return { perfectCube: root ** 3 === value, root };
  },
});
export const runPerfectCubeChecker = perfectCubeCheckerTool.execute;
export default perfectCubeCheckerTool;
