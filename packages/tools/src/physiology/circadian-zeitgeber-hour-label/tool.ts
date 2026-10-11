import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsedHours: number;
  readonly suppliedCycleHours: number;
};
export type Output = {
  readonly phaseHours: number;
  readonly cycleIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedHours: { type: "number" },
    suppliedCycleHours: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["elapsedHours", "suppliedCycleHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseHours: { type: "number" },
    cycleIndex: { type: "integer" },
  },
  required: ["phaseHours", "cycleIndex"],
} as const;
/** Wrap explicit elapsed hours from a caller-defined zeitgeber zero into a supplied cycle without inferring circadian phase. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsedHours, suppliedCycleHours } = request;
  const compute = (): Output => {
    (H.domain(suppliedCycleHours > 0, "suppliedCycleHours"),
      suppliedCycleHours);
    return (() => {
      const cycleIndex = Math.floor(elapsedHours / suppliedCycleHours),
        r = elapsedHours % suppliedCycleHours;
      const wrapped = r < 0 ? r + suppliedCycleHours : r;
      return {
        phaseHours: wrapped === suppliedCycleHours ? 0 : wrapped,
        cycleIndex,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsedHours: 27, suppliedCycleHours: 24 },
  output: { phaseHours: 3, cycleIndex: 1 },
} satisfies ToolExample<Input, Output>;
export const circadianZeitgeberHourLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["physiology", "biology"],
      keywords: ["physiology", "biology"],
    },
    id: "physiology/circadian-zeitgeber-hour-label",
    title: "Circadian Zeitgeber Hour Label",
    description:
      "Wrap explicit elapsed hours from a caller-defined zeitgeber zero into a supplied cycle without inferring circadian phase.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedHours: { type: "number" },
        suppliedCycleHours: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["elapsedHours", "suppliedCycleHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseHours: { type: "number" },
        cycleIndex: { type: "integer" },
      },
      required: ["phaseHours", "cycleIndex"],
    },
    ports: {
      inputs: [
        {
          id: "elapsedHours",
          label: "Elapsed Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCycleHours",
          label: "Supplied Cycle Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "phaseHours",
          label: "Phase Hours",
          valueType: { type: "number" },
        },
        {
          id: "cycleIndex",
          label: "Cycle Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = circadianZeitgeberHourLabelTool.execute;
export default circadianZeitgeberHourLabelTool;
