import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsedDays: number;
  readonly firstPeriod: number;
  readonly secondPeriod: number;
  readonly firstInitialPhase: number;
  readonly secondInitialPhase: number;
};
export type Output = {
  readonly firstPhase: number;
  readonly secondPhase: number;
  readonly separation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedDays: { type: "number" },
    firstPeriod: { type: "number", exclusiveMinimum: 0 },
    secondPeriod: { type: "number", exclusiveMinimum: 0 },
    firstInitialPhase: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    secondInitialPhase: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: [
    "elapsedDays",
    "firstPeriod",
    "secondPeriod",
    "firstInitialPhase",
    "secondInitialPhase",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPhase: { type: "number" },
    secondPhase: { type: "number" },
    separation: { type: "number" },
  },
  required: ["firstPhase", "secondPhase", "separation"],
} as const;
/** Uniform fictional phase cycles in turns; separation is the forward second-minus-first phase modulo one. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    elapsedDays,
    firstPeriod,
    secondPeriod,
    firstInitialPhase,
    secondInitialPhase,
  } = request;
  const compute = (): Output => {
    H.positive(firstPeriod);
    H.positive(secondPeriod);
    H.domain(
      firstInitialPhase >= 0 &&
        firstInitialPhase < 1 &&
        secondInitialPhase >= 0 &&
        secondInitialPhase < 1,
    );
    return {
      firstPhase: H.mod(firstInitialPhase + elapsedDays / firstPeriod, 1),
      secondPhase: H.mod(secondInitialPhase + elapsedDays / secondPeriod, 1),
      separation: H.mod(
        secondInitialPhase +
          elapsedDays / secondPeriod -
          firstInitialPhase -
          elapsedDays / firstPeriod,
        1,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    elapsedDays: 6,
    firstPeriod: 12,
    secondPeriod: 24,
    firstInitialPhase: 0,
    secondInitialPhase: 0,
  },
  output: { firstPhase: 0.5, secondPhase: 0.25, separation: 0.75 },
} satisfies ToolExample<Input, Output>;
export const fictionalCalendarTwoMoonPhaseOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "creative-writing/fictional-calendar-two-moon-phase-offset",
      title: "Fictional Calendar Two Moon Phase Offset Tool",
      description:
        "Uniform fictional phase cycles in turns; separation is the forward second-minus-first phase modulo one.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elapsedDays: { type: "number" },
          firstPeriod: { type: "number", exclusiveMinimum: 0 },
          secondPeriod: { type: "number", exclusiveMinimum: 0 },
          firstInitialPhase: {
            type: "number",
            minimum: 0,
            exclusiveMaximum: 1,
          },
          secondInitialPhase: {
            type: "number",
            minimum: 0,
            exclusiveMaximum: 1,
          },
        },
        required: [
          "elapsedDays",
          "firstPeriod",
          "secondPeriod",
          "firstInitialPhase",
          "secondInitialPhase",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstPhase: { type: "number" },
          secondPhase: { type: "number" },
          separation: { type: "number" },
        },
        required: ["firstPhase", "secondPhase", "separation"],
      },
      ports: {
        inputs: [
          {
            id: "elapsedDays",
            label: "Elapsed Days",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstPeriod",
            label: "First Period",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondPeriod",
            label: "Second Period",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstInitialPhase",
            label: "First Initial Phase",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondInitialPhase",
            label: "Second Initial Phase",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "firstPhase",
            label: "First Phase",
            valueType: { type: "number" },
          },
          {
            id: "secondPhase",
            label: "Second Phase",
            valueType: { type: "number" },
          },
          {
            id: "separation",
            label: "Separation",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = fictionalCalendarTwoMoonPhaseOffsetTool.execute;
export default fictionalCalendarTwoMoonPhaseOffsetTool;
