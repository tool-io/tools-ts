import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personTime: readonly number[];
  readonly atRisk: readonly boolean[];
  readonly observed: readonly boolean[];
};
export type Output = {
  readonly atRiskTime: number;
  readonly observedRiskTime: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personTime: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    atRisk: { type: "array", maxItems: 256, items: { type: "boolean" } },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["personTime", "atRisk", "observed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    atRiskTime: { type: "number" },
    observedRiskTime: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["atRiskTime", "observedRiskTime", "share", "defined"],
} as const;
/** Calculate person time risk support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personTime, atRisk, observed } = request;
  const compute = (): Output => {
    H.sameLength(personTime, atRisk);
    H.sameLength(personTime, observed);
    H.domain(personTime.every((x) => x >= 0));
    return (() => {
      const atRiskTime = personTime.reduce(
          (s, x, i) => s + (atRisk[i] ? x : 0),
          0,
        ),
        observedRiskTime = personTime.reduce(
          (s, x, i) => s + (atRisk[i] && observed[i] ? x : 0),
          0,
        );
      return {
        atRiskTime,
        observedRiskTime,
        share: atRiskTime > 0 ? observedRiskTime / atRiskTime : 0,
        defined: atRiskTime > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    personTime: [2, 3, 5],
    atRisk: [true, true, false],
    observed: [true, false, true],
  },
  output: { atRiskTime: 5, observedRiskTime: 2, share: 0.4, defined: true },
} satisfies ToolExample<Input, Output>;
export const personTimeRiskSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/person-time-risk-support-share",
    title: "Person Time Risk Support Share Tool",
    description:
      "Calculate person time risk support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personTime: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        atRisk: { type: "array", maxItems: 256, items: { type: "boolean" } },
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["personTime", "atRisk", "observed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        atRiskTime: { type: "number" },
        observedRiskTime: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["atRiskTime", "observedRiskTime", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "personTime",
          label: "Person Time",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "atRisk",
          label: "At Risk",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "atRiskTime",
          label: "At Risk Time",
          valueType: { type: "number" },
        },
        {
          id: "observedRiskTime",
          label: "Observed Risk Time",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = personTimeRiskSupportShareTool.execute;
export default personTimeRiskSupportShareTool;
