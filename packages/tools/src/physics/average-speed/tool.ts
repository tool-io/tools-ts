import { createSimpleTool, simpleError } from "../../core/simple.js";
export const averageSpeedTool = createSimpleTool({
  id: "physics/average-speed",
  title: "Average Speed Calculator",
  description: "Calculate average speed from total distance and elapsed time.",
  inputs: [
    { id: "distance", label: "Distance", kind: "number", format: "length" },
    { id: "time", label: "Time", kind: "number", format: "duration" },
  ],
  outputs: [
    { id: "speed", label: "Average speed", kind: "number", format: "speed" },
  ],
  calculate: (input) => {
    const time = input.time as number;
    if (time <= 0) simpleError("time", "Time must be positive.");
    return { speed: (input.distance as number) / time };
  },
});
export const runAverageSpeed = averageSpeedTool.execute;
export default averageSpeedTool;
