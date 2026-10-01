import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly positions: number;
  readonly targetIndex: number;
  readonly cyclesBefore: number;
  readonly dwellSeconds: number;
  readonly activationSeconds: number;
};
export type Output = {
  readonly scanSteps: number;
  readonly expectedSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positions: { type: "integer", minimum: 1 },
    targetIndex: { type: "integer", minimum: 0 },
    cyclesBefore: { type: "integer", minimum: 0 },
    dwellSeconds: { type: "number", minimum: 0 },
    activationSeconds: { type: "number", minimum: 0 },
  },
  required: [
    "positions",
    "targetIndex",
    "cyclesBefore",
    "dwellSeconds",
    "activationSeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scanSteps: { type: "integer" },
    expectedSeconds: { type: "number" },
  },
  required: ["scanSteps", "expectedSeconds"],
} as const;
/** Selection delay from a zero-based scan target and explicit completed cycles. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    positions,
    targetIndex,
    cyclesBefore,
    dwellSeconds,
    activationSeconds,
  } = request;
  const compute = (): Output => {
    H.integer(positions, 1);
    H.integer(targetIndex, 0, positions - 1);
    H.integer(cyclesBefore, 0);
    H.domain(dwellSeconds >= 0 && activationSeconds >= 0);
    return {
      scanSteps: cyclesBefore * positions + targetIndex,
      expectedSeconds:
        (cyclesBefore * positions + targetIndex) * dwellSeconds +
        activationSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    positions: 8,
    targetIndex: 3,
    cyclesBefore: 1,
    dwellSeconds: 0.5,
    activationSeconds: 0.2,
  },
  output: { scanSteps: 11, expectedSeconds: 5.7 },
} satisfies ToolExample<Input, Output>;
export const assistiveSwitchScanSelectionTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-therapy/assistive-switch-scan-selection-time",
    title: "Assistive Switch Scan Selection Time Tool",
    description:
      "Selection delay from a zero-based scan target and explicit completed cycles.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positions: { type: "integer", minimum: 1 },
        targetIndex: { type: "integer", minimum: 0 },
        cyclesBefore: { type: "integer", minimum: 0 },
        dwellSeconds: { type: "number", minimum: 0 },
        activationSeconds: { type: "number", minimum: 0 },
      },
      required: [
        "positions",
        "targetIndex",
        "cyclesBefore",
        "dwellSeconds",
        "activationSeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scanSteps: { type: "integer" },
        expectedSeconds: { type: "number" },
      },
      required: ["scanSteps", "expectedSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "positions",
          label: "Positions",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetIndex",
          label: "Target Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cyclesBefore",
          label: "Cycles Before",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "dwellSeconds",
          label: "Dwell Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "activationSeconds",
          label: "Activation Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scanSteps",
          label: "Scan Steps",
          valueType: { type: "integer" },
        },
        {
          id: "expectedSeconds",
          label: "Expected Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = assistiveSwitchScanSelectionTimeTool.execute;
export default assistiveSwitchScanSelectionTimeTool;
