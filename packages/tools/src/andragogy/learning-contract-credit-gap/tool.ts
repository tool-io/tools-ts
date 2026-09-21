import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly agreedCredits: readonly number[];
  readonly acceptedCredits: readonly number[];
  readonly pendingCredits: readonly number[];
};
export type Output = {
  readonly agreedTotal: number;
  readonly acceptedTotal: number;
  readonly unaccountedCredits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    agreedCredits: { type: "array", maxItems: 256, items: { type: "number" } },
    acceptedCredits: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    pendingCredits: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["agreedCredits", "acceptedCredits", "pendingCredits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    agreedTotal: { type: "number" },
    acceptedTotal: { type: "number" },
    unaccountedCredits: { type: "number" },
  },
  required: ["agreedTotal", "acceptedTotal", "unaccountedCredits"],
} as const;
/** Calculate learning contract credit gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { agreedCredits, acceptedCredits, pendingCredits } = request;
  const compute = (): Output => {
    H.sameLength(agreedCredits, acceptedCredits);
    H.sameLength(acceptedCredits, pendingCredits);
    H.domain(
      [...agreedCredits, ...acceptedCredits, ...pendingCredits].every(
        (x) => x >= 0,
      ),
    );
    return (() => {
      const agreedTotal = agreedCredits.reduce((a, b) => a + b, 0),
        acceptedTotal = acceptedCredits.reduce((a, b) => a + b, 0);
      return {
        agreedTotal,
        acceptedTotal,
        unaccountedCredits:
          agreedTotal -
          acceptedTotal -
          pendingCredits.reduce((a, b) => a + b, 0),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    agreedCredits: [2, 3],
    acceptedCredits: [1, 2],
    pendingCredits: [1, 0],
  },
  output: { agreedTotal: 5, acceptedTotal: 3, unaccountedCredits: 1 },
} satisfies ToolExample<Input, Output>;
export const learningContractCreditGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "andragogy/learning-contract-credit-gap",
    title: "Learning Contract Credit Gap Tool",
    description:
      "Calculate learning contract credit gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        agreedCredits: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        acceptedCredits: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        pendingCredits: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["agreedCredits", "acceptedCredits", "pendingCredits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        agreedTotal: { type: "number" },
        acceptedTotal: { type: "number" },
        unaccountedCredits: { type: "number" },
      },
      required: ["agreedTotal", "acceptedTotal", "unaccountedCredits"],
    },
    ports: {
      inputs: [
        {
          id: "agreedCredits",
          label: "Agreed Credits",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "acceptedCredits",
          label: "Accepted Credits",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "pendingCredits",
          label: "Pending Credits",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "agreedTotal",
          label: "Agreed Total",
          valueType: { type: "number" },
        },
        {
          id: "acceptedTotal",
          label: "Accepted Total",
          valueType: { type: "number" },
        },
        {
          id: "unaccountedCredits",
          label: "Unaccounted Credits",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = learningContractCreditGapTool.execute;
export default learningContractCreditGapTool;
