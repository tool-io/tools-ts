import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const criticalReflectionAnglePostCriticalNoteCheckerExample = {
  input: {
    velocityUpperMS: 2000,
    velocityLowerMS: 4000,
    incidenceAngleDeg: 40,
  },
  output: {
    criticalAngleDeg: (Math.asin(2000 / 4000) * 180) / Math.PI,
    postCritical: 40 > (Math.asin(2000 / 4000) * 180) / Math.PI,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const criticalReflectionAnglePostCriticalNoteCheckerTool =
  createSimpleTool({
    calculate: (input: Readonly<Record<string, unknown>>) =>
      (({ velocityUpperMS, velocityLowerMS, incidenceAngleDeg }) => {
        if (velocityUpperMS <= 0)
          simpleError(
            "velocityUpperMS",
            "Upper-layer velocity must be positive.",
          );
        if (velocityUpperMS >= velocityLowerMS)
          simpleError("velocityLowerMS", "Critical reflection needs V₂ > V₁.");
        const ic =
          (Math.asin(velocityUpperMS / velocityLowerMS) * 180) / Math.PI;
        return { criticalAngleDeg: ic, postCritical: incidenceAngleDeg > ic };
      })(input as never) as Record<string, unknown>,
    description:
      "Critical angle for a reflecting interface from velocity contrast, with post-critical guidance.",
    id: "seismology/critical-reflection-angle-post-critical-note-checker",
    inputs: [
      {
        minimum: 0,
        description: "Velocity above the interface.",
        id: "velocityUpperMS",
        kind: "number",
        label: "V₁",
        unit: "m/s",
      },
      {
        minimum: 0,
        description: "Velocity below the interface.",
        id: "velocityLowerMS",
        kind: "number",
        label: "V₂",
        unit: "m/s",
      },
      {
        minimum: 0,
        maximum: 90,
        description: "Ray incidence angle to test.",
        id: "incidenceAngleDeg",
        kind: "number",
        label: "i",
        unit: "°",
      },
    ],
    outputs: [
      {
        description: "Critical angle.",
        id: "criticalAngleDeg",
        kind: "number",
        label: "i_c",
        unit: "°",
      },
      {
        description: "Whether the tested ray is beyond critical.",
        id: "postCritical",
        kind: "boolean",
        label: "Post-crit?",
      },
    ],
    title: "Critical Reflection Angle Post Critical Note Checker",
  });
export const runCriticalReflectionAnglePostCriticalNoteChecker =
  criticalReflectionAnglePostCriticalNoteCheckerTool.execute;
export { criticalReflectionAnglePostCriticalNoteCheckerExample as example };
export default criticalReflectionAnglePostCriticalNoteCheckerTool;
