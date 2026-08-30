import { createTwoWayClassifier } from "../../core/operational.js";

const operation = createTwoWayClassifier({
  description:
    "Classify caller-observed indicators for die polish vs. flow lines while preserving mixed and insufficient evidence.",
  example: {
    repeatOnDiePair: true,
    stopsAtDevices: true,
    radialFromCenter: false,
    formsLusterCartwheel: false,
  },
  first: { value: "die-polish-lines", label: "Die-polish indicators" },
  id: "numismatics/die-polish-vs-flow-lines",
  indicators: [
    { id: "repeatOnDiePair", label: "Repeats on a die pair", side: "first" },
    { id: "stopsAtDevices", label: "Stops at devices", side: "first" },
    {
      id: "radialFromCenter",
      label: "Radial from strike center",
      side: "second",
    },
    {
      id: "formsLusterCartwheel",
      label: "Forms cartwheel luster",
      side: "second",
    },
  ],
  second: { value: "metal-flow-lines", label: "Flow-line indicators" },
  title: "Die Polish vs. Flow Lines",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
