import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly durations: readonly number[];
  readonly inDeclaredPhase: readonly boolean[];
  readonly sampleAvailable: readonly boolean[];
};
export type Output = {
  readonly phaseDuration: number;
  readonly sampledPhaseDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    inDeclaredPhase: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    sampleAvailable: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["durations", "inDeclaredPhase", "sampleAvailable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseDuration: { type: "number" },
    sampledPhaseDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["phaseDuration", "sampledPhaseDuration", "share", "defined"],
} as const;
/** Calculate diurnal sampling exposure share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { durations, inDeclaredPhase, sampleAvailable } = request;
  const compute = (): Output => {
    H.sameLength(durations, inDeclaredPhase);
    H.sameLength(durations, sampleAvailable);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const phaseDuration = durations.reduce(
          (s, x, i) => s + (inDeclaredPhase[i] ? x : 0),
          0,
        ),
        sampledPhaseDuration = durations.reduce(
          (s, x, i) => s + (inDeclaredPhase[i] && sampleAvailable[i] ? x : 0),
          0,
        );
      return {
        phaseDuration,
        sampledPhaseDuration,
        share: phaseDuration > 0 ? sampledPhaseDuration / phaseDuration : 0,
        defined: phaseDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    durations: [2, 3, 5],
    inDeclaredPhase: [true, true, false],
    sampleAvailable: [true, false, true],
  },
  output: {
    phaseDuration: 5,
    sampledPhaseDuration: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const diurnalSamplingExposureShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endocrinology/diurnal-sampling-exposure-share",
    title: "Diurnal Sampling Exposure Share Tool",
    description:
      "Calculate diurnal sampling exposure share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        inDeclaredPhase: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        sampleAvailable: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["durations", "inDeclaredPhase", "sampleAvailable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseDuration: { type: "number" },
        sampledPhaseDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["phaseDuration", "sampledPhaseDuration", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "inDeclaredPhase",
          label: "In Declared Phase",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sampleAvailable",
          label: "Sample Available",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "phaseDuration",
          label: "Phase Duration",
          valueType: { type: "number" },
        },
        {
          id: "sampledPhaseDuration",
          label: "Sampled Phase Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = diurnalSamplingExposureShareTool.execute;
export default diurnalSamplingExposureShareTool;
