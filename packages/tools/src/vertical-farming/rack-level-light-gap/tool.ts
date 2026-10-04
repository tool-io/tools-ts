import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly levelIds: readonly string[];
  readonly lightReadings: readonly number[];
  readonly targetReadings: readonly number[];
  readonly verified: readonly boolean[];
};
export type Output = {
  readonly verifiedLevels: number;
  readonly residuals: readonly number[];
  readonly maximumAbsoluteGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    levelIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    lightReadings: { type: "array", maxItems: 256, items: { type: "number" } },
    targetReadings: { type: "array", maxItems: 256, items: { type: "number" } },
    verified: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["levelIds", "lightReadings", "targetReadings", "verified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verifiedLevels: { type: "integer" },
    residuals: { type: "array", maxItems: 256, items: { type: "number" } },
    maximumAbsoluteGap: { type: "number" },
  },
  required: ["verifiedLevels", "residuals", "maximumAbsoluteGap"],
} as const;
/** Calculate rack level light gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { levelIds, lightReadings, targetReadings, verified } = request;
  const compute = (): Output => {
    H.sameLength(levelIds, lightReadings);
    H.sameLength(levelIds, targetReadings);
    H.sameLength(levelIds, verified);
    return (() => {
      const residuals = lightReadings.map((x, i) => x - targetReadings[i]);
      return {
        verifiedLevels: new Set(levelIds.filter((x, i) => verified[i])).size,
        residuals,
        maximumAbsoluteGap: Math.max(
          0,
          ...residuals.filter((x, i) => verified[i]).map(Math.abs),
        ),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    levelIds: ["a", "b"],
    lightReadings: [10, 20],
    targetReadings: [8, 25],
    verified: [true, false],
  },
  output: { verifiedLevels: 1, residuals: [2, -5], maximumAbsoluteGap: 2 },
} satisfies ToolExample<Input, Output>;
export const rackLevelLightGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "vertical-farming/rack-level-light-gap",
    title: "Rack Level Light Gap Tool",
    description:
      "Calculate rack level light gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        levelIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        lightReadings: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        targetReadings: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        verified: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["levelIds", "lightReadings", "targetReadings", "verified"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        verifiedLevels: { type: "integer" },
        residuals: { type: "array", maxItems: 256, items: { type: "number" } },
        maximumAbsoluteGap: { type: "number" },
      },
      required: ["verifiedLevels", "residuals", "maximumAbsoluteGap"],
    },
    ports: {
      inputs: [
        {
          id: "levelIds",
          label: "Level Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "lightReadings",
          label: "Light Readings",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "targetReadings",
          label: "Target Readings",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "verified",
          label: "Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "verifiedLevels",
          label: "Verified Levels",
          valueType: { type: "integer" },
        },
        {
          id: "residuals",
          label: "Residuals",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "maximumAbsoluteGap",
          label: "Maximum Absolute Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rackLevelLightGapTool.execute;
export default rackLevelLightGapTool;
