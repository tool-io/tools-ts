import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly registered: number;
  readonly observers: number;
  readonly suspended: number;
  readonly observerSuspended: number;
};
export type Output = { readonly eligibleParties: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    registered: { type: "integer", minimum: 0 },
    observers: { type: "integer", minimum: 0 },
    suspended: { type: "integer", minimum: 0 },
    observerSuspended: { type: "integer", minimum: 0 },
  },
  required: ["registered", "observers", "suspended", "observerSuspended"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eligibleParties: { type: "integer" } },
  required: ["eligibleParties"],
} as const;
/** Deduplicate explicitly supplied observer/suspension exclusions without determining treaty membership. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { registered, observers, suspended, observerSuspended } = request;
  const compute = (): Output => {
    H.integer(registered, 0);
    H.integer(observers, 0, registered);
    H.integer(suspended, 0, registered);
    H.integer(observerSuspended, 0, Math.min(observers, suspended));
    H.domain(observers + suspended - observerSuspended <= registered);
    return {
      eligibleParties: registered - observers - suspended + observerSuspended,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { registered: 100, observers: 10, suspended: 5, observerSuspended: 2 },
  output: { eligibleParties: 87 },
} satisfies ToolExample<Input, Output>;
export const treatyPartyCountObserverExclusionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/treaty-party-count-observer-exclusion",
    title: "Treaty Party Count Observer Exclusion Tool",
    description:
      "Deduplicate explicitly supplied observer/suspension exclusions without determining treaty membership.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        registered: { type: "integer", minimum: 0 },
        observers: { type: "integer", minimum: 0 },
        suspended: { type: "integer", minimum: 0 },
        observerSuspended: { type: "integer", minimum: 0 },
      },
      required: ["registered", "observers", "suspended", "observerSuspended"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { eligibleParties: { type: "integer" } },
      required: ["eligibleParties"],
    },
    ports: {
      inputs: [
        {
          id: "registered",
          label: "Registered",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observers",
          label: "Observers",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suspended",
          label: "Suspended",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observerSuspended",
          label: "Observer Suspended",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "eligibleParties",
          label: "Eligible Parties",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = treatyPartyCountObserverExclusionTool.execute;
export default treatyPartyCountObserverExclusionTool;
