import { createSimpleTool, simpleError } from "../../core/simple.js";
export const angleTool = createSimpleTool({
  id: "vector/angle",
  title: "Angle Between Vectors Calculator",
  description:
    "Calculate the smaller angle between two nonzero vectors in radians and degrees.",
  inputs: [
    {
      id: "first",
      label: "First vector",
      kind: "numberList",
      format: "vector",
    },
    {
      id: "second",
      label: "Second vector",
      kind: "numberList",
      format: "vector",
    },
  ],
  outputs: [
    { id: "radians", label: "Angle", kind: "number", unit: "rad" },
    { id: "degrees", label: "Angle", kind: "number", unit: "deg" },
  ],
  calculate: (input) => {
    const first = input.first as number[],
      second = input.second as number[];
    if (first.length === 0 || first.length !== second.length)
      simpleError("second", "Vectors must have the same nonzero length.");
    const m1 = Math.hypot(...first),
      m2 = Math.hypot(...second);
    if (m1 === 0 || m2 === 0)
      simpleError("first", "Vectors must have nonzero magnitude.");
    const cosine = Math.max(
        -1,
        Math.min(
          1,
          first.reduce((sum, value, index) => sum + value * second[index]!, 0) /
            (m1 * m2),
        ),
      ),
      radians = Math.acos(cosine);
    return { radians, degrees: (radians * 180) / Math.PI };
  },
});
export const runAngle = angleTool.execute;
export default angleTool;
