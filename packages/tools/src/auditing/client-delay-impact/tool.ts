import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly plannedCompletionDays: number;
  readonly clientDelayDays: number;
  readonly recoverableDays: number;
  readonly dailyTeamCost: number;
}>;
export type Output = Readonly<{
  readonly netDelayDays: number;
  readonly revisedCompletionDays: number;
  readonly incrementalCost: number;
}>;

export const calculate = (input: Input): Output => {
  const netDelayDays = Math.max(
    0,
    input.clientDelayDays - input.recoverableDays,
  );
  return {
    netDelayDays,
    revisedCompletionDays: input.plannedCompletionDays + netDelayDays,
    incrementalCost: netDelayDays * input.dailyTeamCost,
  };
};

export const exampleInput = {
  plannedCompletionDays: 30,
  clientDelayDays: 10,
  recoverableDays: 4,
  dailyTeamCost: 1000,
} satisfies Input;
export const exampleOutput = {
  netDelayDays: 6,
  revisedCompletionDays: 36,
  incrementalCost: 6000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      plannedCompletionDays: input.plannedCompletionDays as number,
      clientDelayDays: input.clientDelayDays as number,
      recoverableDays: input.recoverableDays as number,
      dailyTeamCost: input.dailyTeamCost as number,
    }),
  description: "Quantify schedule and cost impact from a client-caused delay.",
  id: "auditing/client-delay-impact",
  inputs: [
    {
      id: "plannedCompletionDays",
      label: "Planned completion duration",
      kind: "number",
      minimum: 0,
      unit: "days",
    },
    {
      id: "clientDelayDays",
      label: "Client-caused delay",
      kind: "number",
      minimum: 0,
      unit: "days",
    },
    {
      id: "recoverableDays",
      label: "Delay days recoverable through resourcing",
      kind: "number",
      minimum: 0,
      unit: "days",
    },
    {
      id: "dailyTeamCost",
      label: "Daily team cost",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "netDelayDays",
      label: "Net schedule delay",
      kind: "number",
      minimum: 0,
      unit: "days",
    },
    {
      id: "revisedCompletionDays",
      label: "Revised completion duration",
      kind: "number",
      minimum: 0,
      unit: "days",
    },
    {
      id: "incrementalCost",
      label: "Incremental delay cost",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Client Delay Impact",
});

export const run = tool.execute;
export default tool;
