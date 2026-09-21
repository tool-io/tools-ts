import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly declaredAreas: readonly number[];
  readonly verifiedAreas: readonly number[];
  readonly eligible: readonly boolean[];
};
export type Output = {
  readonly declaredEligibleArea: number;
  readonly verifiedEligibleArea: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    declaredAreas: { type: "array", maxItems: 256, items: { type: "number" } },
    verifiedAreas: { type: "array", maxItems: 256, items: { type: "number" } },
    eligible: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["declaredAreas", "verifiedAreas", "eligible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    declaredEligibleArea: { type: "number" },
    verifiedEligibleArea: { type: "number" },
    gap: { type: "number" },
  },
  required: ["declaredEligibleArea", "verifiedEligibleArea", "gap"],
} as const;
/** Calculate eligible area source gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { declaredAreas, verifiedAreas, eligible } = request;
  const compute = (): Output => {
    H.sameLength(declaredAreas, verifiedAreas);
    H.sameLength(declaredAreas, eligible);
    H.domain([...declaredAreas, ...verifiedAreas].every((x) => x >= 0));
    return (() => {
      const declaredEligibleArea = declaredAreas.reduce(
          (s, x, i) => s + (eligible[i] ? x : 0),
          0,
        ),
        verifiedEligibleArea = verifiedAreas.reduce(
          (s, x, i) => s + (eligible[i] ? x : 0),
          0,
        );
      return {
        declaredEligibleArea,
        verifiedEligibleArea,
        gap: declaredEligibleArea - verifiedEligibleArea,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    declaredAreas: [10, 20, 30],
    verifiedAreas: [8, 25, 30],
    eligible: [true, true, false],
  },
  output: { declaredEligibleArea: 30, verifiedEligibleArea: 33, gap: -3 },
} satisfies ToolExample<Input, Output>;
export const eligibleAreaSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-policy/eligible-area-source-gap",
    title: "Eligible Area Source Gap Tool",
    description:
      "Calculate eligible area source gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        declaredAreas: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        verifiedAreas: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        eligible: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["declaredAreas", "verifiedAreas", "eligible"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        declaredEligibleArea: { type: "number" },
        verifiedEligibleArea: { type: "number" },
        gap: { type: "number" },
      },
      required: ["declaredEligibleArea", "verifiedEligibleArea", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "declaredAreas",
          label: "Declared Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "verifiedAreas",
          label: "Verified Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "eligible",
          label: "Eligible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "declaredEligibleArea",
          label: "Declared Eligible Area",
          valueType: { type: "number" },
        },
        {
          id: "verifiedEligibleArea",
          label: "Verified Eligible Area",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = eligibleAreaSourceGapTool.execute;
export default eligibleAreaSourceGapTool;
