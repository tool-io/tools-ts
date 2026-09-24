import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLocalMinutes: number;
  readonly firstUtcOffsetMinutes: number;
  readonly secondUtcOffsetMinutes: number;
};
export type Output = {
  readonly secondLocalUnfolded: number;
  readonly dayOffset: number;
  readonly clockMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLocalMinutes: { type: "number", minimum: 0, exclusiveMaximum: 1440 },
    firstUtcOffsetMinutes: { type: "number" },
    secondUtcOffsetMinutes: { type: "number" },
  },
  required: [
    "firstLocalMinutes",
    "firstUtcOffsetMinutes",
    "secondUtcOffsetMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    secondLocalUnfolded: { type: "number" },
    dayOffset: { type: "integer" },
    clockMinutes: { type: "number" },
  },
  required: ["secondLocalUnfolded", "dayOffset", "clockMinutes"],
} as const;
/** Use explicit fixed UTC offsets; no location lookup or daylight-saving rule is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLocalMinutes, firstUtcOffsetMinutes, secondUtcOffsetMinutes } =
    request;
  const compute = (): Output => {
    H.domain(firstLocalMinutes >= 0 && firstLocalMinutes < 1440);
    return {
      secondLocalUnfolded:
        firstLocalMinutes - firstUtcOffsetMinutes + secondUtcOffsetMinutes,
      dayOffset: Math.floor(
        (firstLocalMinutes - firstUtcOffsetMinutes + secondUtcOffsetMinutes) /
          1440,
      ),
      clockMinutes: H.mod(
        firstLocalMinutes - firstUtcOffsetMinutes + secondUtcOffsetMinutes,
        1440,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstLocalMinutes: 1380,
    firstUtcOffsetMinutes: -300,
    secondUtcOffsetMinutes: 60,
  },
  output: { secondLocalUnfolded: 1740, dayOffset: 1, clockMinutes: 300 },
} satisfies ToolExample<Input, Output>;
export const sceneClockTimezoneDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/scene-clock-timezone-difference",
    title: "Scene Clock Timezone Difference Tool",
    description:
      "Use explicit fixed UTC offsets; no location lookup or daylight-saving rule is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLocalMinutes: {
          type: "number",
          minimum: 0,
          exclusiveMaximum: 1440,
        },
        firstUtcOffsetMinutes: { type: "number" },
        secondUtcOffsetMinutes: { type: "number" },
      },
      required: [
        "firstLocalMinutes",
        "firstUtcOffsetMinutes",
        "secondUtcOffsetMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        secondLocalUnfolded: { type: "number" },
        dayOffset: { type: "integer" },
        clockMinutes: { type: "number" },
      },
      required: ["secondLocalUnfolded", "dayOffset", "clockMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "firstLocalMinutes",
          label: "First Local Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "firstUtcOffsetMinutes",
          label: "First Utc Offset Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "secondUtcOffsetMinutes",
          label: "Second Utc Offset Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
      ],
      outputs: [
        {
          id: "secondLocalUnfolded",
          label: "Second Local Unfolded",
          valueType: { type: "number" },
        },
        {
          id: "dayOffset",
          label: "Day Offset",
          valueType: { type: "integer" },
        },
        {
          id: "clockMinutes",
          label: "Clock Minutes",
          valueType: { type: "number", unit: "min" },
        },
      ],
    },
  },
  calculate,
});
export const run = sceneClockTimezoneDifferenceTool.execute;
export default sceneClockTimezoneDifferenceTool;
