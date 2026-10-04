import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activeMinutes: number;
  readonly restingMinutes: number;
  readonly unknownMinutes: number;
  readonly excludeUnknown: boolean;
};
export type Output = {
  readonly knownMinutes: number;
  readonly activeFraction: number;
  readonly unknownFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeMinutes: { type: "number", minimum: 0 },
    restingMinutes: { type: "number", minimum: 0 },
    unknownMinutes: { type: "number", minimum: 0 },
    excludeUnknown: { type: "boolean" },
  },
  required: [
    "activeMinutes",
    "restingMinutes",
    "unknownMinutes",
    "excludeUnknown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    knownMinutes: { type: "number" },
    activeFraction: { type: "number" },
    unknownFraction: { type: "number" },
  },
  required: ["knownMinutes", "activeFraction", "unknownFraction"],
} as const;
/** Calculate animal diary active resting share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activeMinutes, restingMinutes, unknownMinutes, excludeUnknown } =
    request;
  const compute = (): Output => {
    H.domain(
      activeMinutes >= 0 &&
        restingMinutes >= 0 &&
        activeMinutes + restingMinutes > 0 &&
        unknownMinutes >= 0,
    );
    return {
      knownMinutes: activeMinutes + restingMinutes,
      activeFraction:
        activeMinutes /
        (activeMinutes +
          restingMinutes +
          (excludeUnknown ? 0 : unknownMinutes)),
      unknownFraction:
        unknownMinutes / (activeMinutes + restingMinutes + unknownMinutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    activeMinutes: 60,
    restingMinutes: 120,
    unknownMinutes: 60,
    excludeUnknown: true,
  },
  output: {
    knownMinutes: 180,
    activeFraction: 0.3333333333333333,
    unknownFraction: 0.25,
  },
} satisfies ToolExample<Input, Output>;
export const animalDiaryActiveRestingShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/animal-diary-active-resting-share",
    title: "Animal Diary Active Resting Share Tool",
    description:
      "Calculate animal diary active resting share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeMinutes: { type: "number", minimum: 0 },
        restingMinutes: { type: "number", minimum: 0 },
        unknownMinutes: { type: "number", minimum: 0 },
        excludeUnknown: { type: "boolean" },
      },
      required: [
        "activeMinutes",
        "restingMinutes",
        "unknownMinutes",
        "excludeUnknown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        knownMinutes: { type: "number" },
        activeFraction: { type: "number" },
        unknownFraction: { type: "number" },
      },
      required: ["knownMinutes", "activeFraction", "unknownFraction"],
    },
    ports: {
      inputs: [
        {
          id: "activeMinutes",
          label: "Active Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "restingMinutes",
          label: "Resting Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "unknownMinutes",
          label: "Unknown Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "excludeUnknown",
          label: "Exclude Unknown",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "knownMinutes",
          label: "Known Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "activeFraction",
          label: "Active Fraction",
          valueType: { type: "number" },
        },
        {
          id: "unknownFraction",
          label: "Unknown Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = animalDiaryActiveRestingShareTool.execute;
export default animalDiaryActiveRestingShareTool;
