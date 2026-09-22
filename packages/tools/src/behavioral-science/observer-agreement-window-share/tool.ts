import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly durations: readonly number[];
  readonly firstLabels: readonly string[];
  readonly secondLabels: readonly string[];
  readonly valid: readonly boolean[];
};
export type Output = {
  readonly validDuration: number;
  readonly agreementDuration: number;
  readonly agreementShare: number;
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
    firstLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    secondLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["durations", "firstLabels", "secondLabels", "valid"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validDuration: { type: "number" },
    agreementDuration: { type: "number" },
    agreementShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["validDuration", "agreementDuration", "agreementShare", "defined"],
} as const;
/** Calculate observer agreement window share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { durations, firstLabels, secondLabels, valid } = request;
  const compute = (): Output => {
    H.sameLength(durations, firstLabels);
    H.sameLength(durations, secondLabels);
    H.sameLength(durations, valid);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const validDuration = durations.reduce(
          (s, x, i) => s + (valid[i] ? x : 0),
          0,
        ),
        agreementDuration = durations.reduce(
          (s, x, i) =>
            s + (valid[i] && firstLabels[i] === secondLabels[i] ? x : 0),
          0,
        );
      return {
        validDuration,
        agreementDuration,
        agreementShare:
          validDuration > 0 ? agreementDuration / validDuration : 0,
        defined: validDuration > 0,
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
    firstLabels: ["A", "B", "A"],
    secondLabels: ["A", "A", "A"],
    valid: [true, true, false],
  },
  output: {
    validDuration: 5,
    agreementDuration: 2,
    agreementShare: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const observerAgreementWindowShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-science/observer-agreement-window-share",
    title: "Observer Agreement Window Share Tool",
    description:
      "Calculate observer agreement window share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        firstLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        secondLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["durations", "firstLabels", "secondLabels", "valid"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validDuration: { type: "number" },
        agreementDuration: { type: "number" },
        agreementShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "validDuration",
        "agreementDuration",
        "agreementShare",
        "defined",
      ],
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
          id: "firstLabels",
          label: "First Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "secondLabels",
          label: "Second Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "valid",
          label: "Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "validDuration",
          label: "Valid Duration",
          valueType: { type: "number" },
        },
        {
          id: "agreementDuration",
          label: "Agreement Duration",
          valueType: { type: "number" },
        },
        {
          id: "agreementShare",
          label: "Agreement Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = observerAgreementWindowShareTool.execute;
export default observerAgreementWindowShareTool;
