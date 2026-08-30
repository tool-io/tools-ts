import { createTwoWayClassifier } from "../../core/operational.js";

const operation = createTwoWayClassifier({
  description:
    "Classify caller-observed indicators for colonial strike classifier while preserving mixed and insufficient evidence.",
  example: {
    irregularPlanchet: true,
    offCenterDevices: true,
    regularRoundPlanchet: false,
    machineEdgeDevice: false,
  },
  first: { value: "hammered-cob", label: "Hammered-cob indicators" },
  id: "numismatics/colonial-strike-classifier",
  indicators: [
    { id: "irregularPlanchet", label: "Irregular planchet", side: "first" },
    { id: "offCenterDevices", label: "Off-center devices", side: "first" },
    {
      id: "regularRoundPlanchet",
      label: "Regular round planchet",
      side: "second",
    },
    {
      id: "machineEdgeDevice",
      label: "Machine-applied edge device",
      side: "second",
    },
  ],
  second: { value: "milled-strike", label: "Milled-strike indicators" },
  title: "Colonial Strike Classifier",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
