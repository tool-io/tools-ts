import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsed: number;
  readonly firstPause: number;
  readonly secondPause: number;
  readonly sharedPause: number;
  readonly suppliedLimit: number;
};
export type Output = {
  readonly activeElapsed: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number", minimum: 0 },
    firstPause: { type: "number", minimum: 0 },
    secondPause: { type: "number", minimum: 0 },
    sharedPause: { type: "number", minimum: 0 },
    suppliedLimit: { type: "number", minimum: 0 },
  },
  required: [
    "elapsed",
    "firstPause",
    "secondPause",
    "sharedPause",
    "suppliedLimit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { activeElapsed: { type: "number" }, margin: { type: "number" } },
  required: ["activeElapsed", "margin"],
} as const;
/** Supplied pause-union clock accounting, without selecting permit law. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsed, firstPause, secondPause, sharedPause, suppliedLimit } =
    request;
  const compute = (): Output => {
    H.domain(
      elapsed >= 0 &&
        firstPause >= 0 &&
        secondPause >= 0 &&
        sharedPause >= 0 &&
        sharedPause <= Math.min(firstPause, secondPause) &&
        firstPause + secondPause - sharedPause <= elapsed &&
        suppliedLimit >= 0,
    );
    return {
      activeElapsed: elapsed - firstPause - secondPause + sharedPause,
      margin: suppliedLimit - elapsed + firstPause + secondPause - sharedPause,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    elapsed: 20,
    firstPause: 4,
    secondPause: 3,
    sharedPause: 1,
    suppliedLimit: 15,
  },
  output: { activeElapsed: 14, margin: 1 },
} satisfies ToolExample<Input, Output>;
export const permitClockPauseOverlapTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/permit-clock-pause-overlap-term",
    title: "Permit Clock Pause Overlap Term Tool",
    description:
      "Supplied pause-union clock accounting, without selecting permit law.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number", minimum: 0 },
        firstPause: { type: "number", minimum: 0 },
        secondPause: { type: "number", minimum: 0 },
        sharedPause: { type: "number", minimum: 0 },
        suppliedLimit: { type: "number", minimum: 0 },
      },
      required: [
        "elapsed",
        "firstPause",
        "secondPause",
        "sharedPause",
        "suppliedLimit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeElapsed: { type: "number" },
        margin: { type: "number" },
      },
      required: ["activeElapsed", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstPause",
          label: "First Pause",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondPause",
          label: "Second Pause",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedPause",
          label: "Shared Pause",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLimit",
          label: "Supplied Limit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "activeElapsed",
          label: "Active Elapsed",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = permitClockPauseOverlapTermTool.execute;
export default permitClockPauseOverlapTermTool;
