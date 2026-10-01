import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stepDurations: readonly number[];
  readonly documented: readonly boolean[];
  readonly sourceVerified: readonly boolean[];
};
export type Output = {
  readonly totalDuration: number;
  readonly documentedDuration: number;
  readonly verifiedDuration: number;
  readonly verifiedShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stepDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    documented: { type: "array", maxItems: 256, items: { type: "boolean" } },
    sourceVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["stepDurations", "documented", "sourceVerified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalDuration: { type: "number" },
    documentedDuration: { type: "number" },
    verifiedDuration: { type: "number" },
    verifiedShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "totalDuration",
    "documentedDuration",
    "verifiedDuration",
    "verifiedShare",
    "defined",
  ],
} as const;
/** Calculate oral procedure source share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stepDurations, documented, sourceVerified } = request;
  const compute = (): Output => {
    H.sameLength(stepDurations, documented);
    H.sameLength(stepDurations, sourceVerified);
    H.domain(stepDurations.every((x) => x >= 0));
    return (() => {
      const totalDuration = stepDurations.reduce((a, b) => a + b, 0),
        documentedDuration = stepDurations.reduce(
          (s, x, i) => s + (documented[i] ? x : 0),
          0,
        ),
        verifiedDuration = stepDurations.reduce(
          (s, x, i) => s + (documented[i] && sourceVerified[i] ? x : 0),
          0,
        );
      return {
        totalDuration,
        documentedDuration,
        verifiedDuration,
        verifiedShare: totalDuration > 0 ? verifiedDuration / totalDuration : 0,
        defined: totalDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stepDurations: [2, 3, 5],
    documented: [true, true, false],
    sourceVerified: [true, false, true],
  },
  output: {
    totalDuration: 10,
    documentedDuration: 5,
    verifiedDuration: 2,
    verifiedShare: 0.2,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const oralProcedureSourceShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oral-surgery/oral-procedure-source-share",
    title: "Oral Procedure Source Share Tool",
    description:
      "Calculate oral procedure source share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stepDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        documented: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        sourceVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["stepDurations", "documented", "sourceVerified"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalDuration: { type: "number" },
        documentedDuration: { type: "number" },
        verifiedDuration: { type: "number" },
        verifiedShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "totalDuration",
        "documentedDuration",
        "verifiedDuration",
        "verifiedShare",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "stepDurations",
          label: "Step Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "documented",
          label: "Documented",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sourceVerified",
          label: "Source Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "totalDuration",
          label: "Total Duration",
          valueType: { type: "number" },
        },
        {
          id: "documentedDuration",
          label: "Documented Duration",
          valueType: { type: "number" },
        },
        {
          id: "verifiedDuration",
          label: "Verified Duration",
          valueType: { type: "number" },
        },
        {
          id: "verifiedShare",
          label: "Verified Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = oralProcedureSourceShareTool.execute;
export default oralProcedureSourceShareTool;
