import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly phaseEnd: number;
  readonly archivedTime: number;
  readonly suppliedClockOffset: number;
};
export type Output = {
  readonly delay: number;
  readonly archivedBeforeEnd: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseEnd: { type: "number" },
    archivedTime: { type: "number" },
    suppliedClockOffset: { type: "number" },
  },
  required: ["phaseEnd", "archivedTime", "suppliedClockOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delay: { type: "number" },
    archivedBeforeEnd: { type: "boolean" },
  },
  required: ["delay", "archivedBeforeEnd"],
} as const;
/** Compare supplied study/archive timestamps without selecting retention or GLP requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { phaseEnd, archivedTime, suppliedClockOffset } = request;
  const compute = (): Output => {
    return {
      delay: archivedTime - suppliedClockOffset - phaseEnd,
      archivedBeforeEnd: archivedTime - suppliedClockOffset < phaseEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { phaseEnd: 100, archivedTime: 130, suppliedClockOffset: 5 },
  output: { delay: 25, archivedBeforeEnd: false },
} satisfies ToolExample<Input, Output>;
export const studyPhaseArchiveDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/study-phase-archive-delay",
    title: "Study Phase Archive Delay Tool",
    description:
      "Compare supplied study/archive timestamps without selecting retention or GLP requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseEnd: { type: "number" },
        archivedTime: { type: "number" },
        suppliedClockOffset: { type: "number" },
      },
      required: ["phaseEnd", "archivedTime", "suppliedClockOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delay: { type: "number" },
        archivedBeforeEnd: { type: "boolean" },
      },
      required: ["delay", "archivedBeforeEnd"],
    },
    ports: {
      inputs: [
        {
          id: "phaseEnd",
          label: "Phase End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "archivedTime",
          label: "Archived Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedClockOffset",
          label: "Supplied Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "delay", label: "Delay", valueType: { type: "number" } },
        {
          id: "archivedBeforeEnd",
          label: "Archived Before End",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = studyPhaseArchiveDelayTool.execute;
export default studyPhaseArchiveDelayTool;
