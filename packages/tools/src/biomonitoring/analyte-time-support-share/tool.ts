import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly analyteIds: readonly string[];
  readonly durations: readonly number[];
  readonly quantifiable: readonly boolean[];
  readonly sourceValid: readonly boolean[];
  readonly selectedAnalyte: string;
};
export type Output = {
  readonly analyteDuration: number;
  readonly supportedDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    analyteIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    durations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    quantifiable: { type: "array", maxItems: 256, items: { type: "boolean" } },
    sourceValid: { type: "array", maxItems: 256, items: { type: "boolean" } },
    selectedAnalyte: { type: "string", maxLength: 8192 },
  },
  required: [
    "analyteIds",
    "durations",
    "quantifiable",
    "sourceValid",
    "selectedAnalyte",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    analyteDuration: { type: "number" },
    supportedDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["analyteDuration", "supportedDuration", "share", "defined"],
} as const;
/** Calculate analyte time support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { analyteIds, durations, quantifiable, sourceValid, selectedAnalyte } =
    request;
  const compute = (): Output => {
    H.sameLength(analyteIds, durations);
    H.sameLength(analyteIds, quantifiable);
    H.sameLength(analyteIds, sourceValid);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const analyteDuration = durations.reduce(
          (s, x, i) => s + (analyteIds[i] === selectedAnalyte ? x : 0),
          0,
        ),
        supportedDuration = durations.reduce(
          (s, x, i) =>
            s +
            (analyteIds[i] === selectedAnalyte &&
            quantifiable[i] &&
            sourceValid[i]
              ? x
              : 0),
          0,
        );
      return {
        analyteDuration,
        supportedDuration,
        share: analyteDuration > 0 ? supportedDuration / analyteDuration : 0,
        defined: analyteDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    analyteIds: ["A", "A", "B"],
    durations: [2, 3, 5],
    quantifiable: [true, true, true],
    sourceValid: [true, false, true],
    selectedAnalyte: "A",
  },
  output: {
    analyteDuration: 5,
    supportedDuration: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const analyteTimeSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomonitoring/analyte-time-support-share",
    title: "Analyte Time Support Share Tool",
    description:
      "Calculate analyte time support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        analyteIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        quantifiable: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        sourceValid: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        selectedAnalyte: { type: "string", maxLength: 8192 },
      },
      required: [
        "analyteIds",
        "durations",
        "quantifiable",
        "sourceValid",
        "selectedAnalyte",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        analyteDuration: { type: "number" },
        supportedDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["analyteDuration", "supportedDuration", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "analyteIds",
          label: "Analyte Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "quantifiable",
          label: "Quantifiable",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sourceValid",
          label: "Source Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "selectedAnalyte",
          label: "Selected Analyte",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "analyteDuration",
          label: "Analyte Duration",
          valueType: { type: "number" },
        },
        {
          id: "supportedDuration",
          label: "Supported Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = analyteTimeSupportShareTool.execute;
export default analyteTimeSupportShareTool;
