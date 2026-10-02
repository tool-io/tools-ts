import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseMagnitudes: readonly number[];
  readonly durations: readonly number[];
  readonly valid: readonly boolean[];
  readonly baselineAvailable: readonly boolean[];
};
export type Output = {
  readonly absoluteResponseTime: number;
  readonly supportedResponseTime: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseMagnitudes: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    durations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
    baselineAvailable: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["responseMagnitudes", "durations", "valid", "baselineAvailable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absoluteResponseTime: { type: "number" },
    supportedResponseTime: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "absoluteResponseTime",
    "supportedResponseTime",
    "share",
    "defined",
  ],
} as const;
/** Calculate response support window share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseMagnitudes, durations, valid, baselineAvailable } = request;
  const compute = (): Output => {
    H.sameLength(responseMagnitudes, durations);
    H.sameLength(responseMagnitudes, valid);
    H.sameLength(responseMagnitudes, baselineAvailable);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const absoluteResponseTime = responseMagnitudes.reduce(
          (s, x, i) => s + Math.abs(x) * durations[i],
          0,
        ),
        supportedResponseTime = responseMagnitudes.reduce(
          (s, x, i) =>
            s +
            (valid[i] && baselineAvailable[i] ? Math.abs(x) * durations[i] : 0),
          0,
        );
      return {
        absoluteResponseTime,
        supportedResponseTime,
        share:
          absoluteResponseTime > 0
            ? supportedResponseTime / absoluteResponseTime
            : 0,
        defined: absoluteResponseTime > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    responseMagnitudes: [2, -3],
    durations: [1, 2],
    valid: [true, true],
    baselineAvailable: [true, false],
  },
  output: {
    absoluteResponseTime: 8,
    supportedResponseTime: 2,
    share: 0.25,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const responseSupportWindowShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacodynamics/response-support-window-share",
    title: "Response Support Window Share Tool",
    description:
      "Calculate response support window share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseMagnitudes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
        baselineAvailable: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "responseMagnitudes",
        "durations",
        "valid",
        "baselineAvailable",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        absoluteResponseTime: { type: "number" },
        supportedResponseTime: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "absoluteResponseTime",
        "supportedResponseTime",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "responseMagnitudes",
          label: "Response Magnitudes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "valid",
          label: "Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "baselineAvailable",
          label: "Baseline Available",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "absoluteResponseTime",
          label: "Absolute Response Time",
          valueType: { type: "number" },
        },
        {
          id: "supportedResponseTime",
          label: "Supported Response Time",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = responseSupportWindowShareTool.execute;
export default responseSupportWindowShareTool;
