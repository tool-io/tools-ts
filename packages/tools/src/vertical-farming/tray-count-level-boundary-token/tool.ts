import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLevel: number;
  readonly lastLevel: number;
  readonly traysPerLevel: number;
  readonly includeFirst: boolean;
  readonly includeLast: boolean;
};
export type Output = { readonly countedLevels: number; readonly trays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLevel: { type: "integer", minimum: 0 },
    lastLevel: { type: "integer" },
    traysPerLevel: { type: "integer", minimum: 0 },
    includeFirst: { type: "boolean" },
    includeLast: { type: "boolean" },
  },
  required: [
    "firstLevel",
    "lastLevel",
    "traysPerLevel",
    "includeFirst",
    "includeLast",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedLevels: { type: "integer" },
    trays: { type: "integer" },
  },
  required: ["countedLevels", "trays"],
} as const;
/** Count supplied rack levels under explicit endpoint inclusion before expanding to tray units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLevel, lastLevel, traysPerLevel, includeFirst, includeLast } =
    request;
  const compute = (): Output => {
    H.integer(firstLevel, 0);
    H.integer(lastLevel, firstLevel);
    H.integer(traysPerLevel, 0);
    const countedLevels = Math.max(
      0,
      lastLevel -
        firstLevel +
        1 -
        (includeFirst ? 0 : 1) -
        (includeLast || (lastLevel === firstLevel && !includeFirst) ? 0 : 1),
    );
    return {
      countedLevels,
      trays: Number(BigInt(countedLevels) * BigInt(traysPerLevel)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstLevel: 1,
    lastLevel: 5,
    traysPerLevel: 8,
    includeFirst: true,
    includeLast: false,
  },
  output: { countedLevels: 4, trays: 32 },
} satisfies ToolExample<Input, Output>;
export const trayCountLevelBoundaryTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/tray-count-level-boundary-token",
    title: "Tray Count Level Boundary Token Tool",
    description:
      "Count supplied rack levels under explicit endpoint inclusion before expanding to tray units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLevel: { type: "integer", minimum: 0 },
        lastLevel: { type: "integer" },
        traysPerLevel: { type: "integer", minimum: 0 },
        includeFirst: { type: "boolean" },
        includeLast: { type: "boolean" },
      },
      required: [
        "firstLevel",
        "lastLevel",
        "traysPerLevel",
        "includeFirst",
        "includeLast",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedLevels: { type: "integer" },
        trays: { type: "integer" },
      },
      required: ["countedLevels", "trays"],
    },
    ports: {
      inputs: [
        {
          id: "firstLevel",
          label: "First Level",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastLevel",
          label: "Last Level",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "traysPerLevel",
          label: "Trays Per Level",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeFirst",
          label: "Include First",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeLast",
          label: "Include Last",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "countedLevels",
          label: "Counted Levels",
          valueType: { type: "integer" },
        },
        { id: "trays", label: "Trays", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = trayCountLevelBoundaryTokenTool.execute;
export default trayCountLevelBoundaryTokenTool;
