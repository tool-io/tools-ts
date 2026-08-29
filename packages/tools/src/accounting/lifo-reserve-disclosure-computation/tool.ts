import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LifoReserveInput = {
  readonly fifoInventory: number;
  readonly incomeTaxRatePercent: number;
  readonly lifoInventory: number;
};

export type LifoReserveOutput = {
  readonly afterTaxLifoReserveEffect: number;
  readonly deferredTaxEffect: number;
  readonly lifoReserve: number;
};

export const lifoReserveExample = {
  input: {
    fifoInventory: 500000,
    incomeTaxRatePercent: 21,
    lifoInventory: 380000,
  },
  output: {
    afterTaxLifoReserveEffect: 94800,
    deferredTaxEffect: 25200,
    lifoReserve: 120000,
  },
} satisfies ToolExample<LifoReserveInput, LifoReserveOutput>;

export const calculateLifoReserve = (
  input: LifoReserveInput,
): LifoReserveOutput => {
  if (!Number.isFinite(input.fifoInventory) || input.fifoInventory < 0)
    simpleError(
      "fifoInventory",
      "The FIFO inventory balance must be a finite non-negative number.",
      "invalid_inventory",
    );
  if (!Number.isFinite(input.lifoInventory) || input.lifoInventory < 0)
    simpleError(
      "lifoInventory",
      "The LIFO inventory balance must be a finite non-negative number.",
      "invalid_inventory",
    );
  if (
    !Number.isFinite(input.incomeTaxRatePercent) ||
    input.incomeTaxRatePercent < 0 ||
    input.incomeTaxRatePercent > 100
  )
    simpleError(
      "incomeTaxRatePercent",
      "The income tax rate must be a percentage between 0 and 100.",
      "invalid_tax_rate",
    );
  const lifoReserve = input.fifoInventory - input.lifoInventory;
  const deferredTaxEffect = lifoReserve * (input.incomeTaxRatePercent / 100);
  const afterTaxLifoReserveEffect = lifoReserve - deferredTaxEffect;
  return {
    afterTaxLifoReserveEffect:
      afterTaxLifoReserveEffect === 0 ? 0 : afterTaxLifoReserveEffect,
    deferredTaxEffect: deferredTaxEffect === 0 ? 0 : deferredTaxEffect,
    lifoReserve: lifoReserve === 0 ? 0 : lifoReserve,
  };
};

export const lifoReserveTool = createSimpleTool({
  calculate: (input) =>
    calculateLifoReserve({
      fifoInventory: input.fifoInventory as number,
      incomeTaxRatePercent: input.incomeTaxRatePercent as number,
      lifoInventory: input.lifoInventory as number,
    }),
  description:
    "Compute the LIFO reserve as FIFO minus LIFO inventory with its deferred tax effect and after-tax impact for disclosure.",
  id: "accounting/lifo-reserve-disclosure-computation",
  inputs: [
    {
      description:
        "Inventory balance under FIFO (or average cost) for the same date as the LIFO balance.",
      id: "fifoInventory",
      kind: "number",
      label: "FIFO inventory",
      minimum: 0,
    },
    {
      description: "Inventory balance under LIFO for the same date.",
      id: "lifoInventory",
      kind: "number",
      label: "LIFO inventory",
      minimum: 0,
    },
    {
      description:
        "Statutory income tax rate on a 0-100 percentage scale used to split the reserve into tax and after-tax effects.",
      id: "incomeTaxRatePercent",
      kind: "number",
      label: "Income tax rate percent",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "LIFO reserve: FIFO inventory minus LIFO inventory; negative when LIFO exceeds FIFO.",
      id: "lifoReserve",
      kind: "number",
      label: "LIFO reserve",
    },
    {
      description:
        "Deferred tax effect of the reserve, the reserve times the tax rate.",
      id: "deferredTaxEffect",
      kind: "number",
      label: "Deferred tax effect",
    },
    {
      description:
        "After-tax effect of the reserve on retained earnings, the reserve less the deferred tax effect.",
      id: "afterTaxLifoReserveEffect",
      kind: "number",
      label: "After-tax reserve effect",
    },
  ],
  title: "LIFO Reserve Disclosure Calculator",
});
export const runLifoReserve = lifoReserveTool.execute;
export default lifoReserveTool;
