import { simpleError } from "../core/simple.js";
import { aligned, bounded } from "../game/shared.js";
import { integer, money, sumMoney, weightedMinor } from "./money.js";
export const fifo = (
  quantities: readonly number[],
  unitCosts: readonly number[],
  issued: number,
): {
  issuedCostMinor: number;
  endingInventoryMinor: number;
  remainingLayerUnits: number[];
} => {
  aligned(quantities, unitCosts, "layers");
  quantities.forEach((v) => bounded(v, "quantity", 0, 1000000));
  unitCosts.forEach((v) => money(v, "unitCost"));
  bounded(issued, "issued", 0, sumMoney(quantities));
  const remaining: number[] = [],
    costs: number[] = [],
    ending: number[] = [];
  let left = issued;
  quantities.forEach((n, i) => {
    const take = Math.min(n, left);
    left -= take;
    remaining.push(n - take);
    costs.push(integer(take * unitCosts[i], "layerCost"));
    ending.push(integer((n - take) * unitCosts[i], "layerCost"));
  });
  return {
    issuedCostMinor: sumMoney(costs),
    endingInventoryMinor: sumMoney(ending),
    remainingLayerUnits: remaining,
  };
};
export const movingAverage = (
  openingUnits: number,
  openingCostMinor: number,
  eventTypes: readonly number[],
  units: readonly number[],
  purchaseTotalsMinor: readonly number[],
): {
  endingUnits: number;
  endingCostMinor: number;
  issueCostsMinor: number[];
  costBalanceAfterEachEventMinor: number[];
} => {
  bounded(openingUnits, "openingUnits", 0, 1000000);
  money(openingCostMinor, "openingCost");
  if (openingUnits === 0 && openingCostMinor !== 0)
    simpleError("inventory", "Zero opening units require zero opening cost.");
  aligned(eventTypes, units, "events");
  aligned(units, purchaseTotalsMinor, "events");
  let count = openingUnits,
    cost = openingCostMinor;
  const issues: number[] = [],
    history: number[] = [];
  eventTypes.forEach((type, i) => {
    bounded(type, "type", 0, 1);
    bounded(units[i], "units", 1, 1000000);
    money(purchaseTotalsMinor[i], "cost");
    if (type === 0) {
      count = bounded(count + units[i], "units", 0, 1000000);
      cost = money(cost + purchaseTotalsMinor[i], "cost");
      issues.push(0);
    } else {
      if (units[i] > count || purchaseTotalsMinor[i] !== 0)
        simpleError(
          "issue",
          "Issues need available units and no purchase amount.",
        );
      const issued = weightedMinor(cost, units[i], count);
      cost -= issued;
      count -= units[i];
      issues.push(issued);
    }
    history.push(cost);
  });
  return {
    endingUnits: count,
    endingCostMinor: cost,
    issueCostsMinor: issues,
    costBalanceAfterEachEventMinor: history,
  };
};
export const depreciation = (
  cost: number,
  salvage: number,
  years: number,
  method: string,
): { annualDepreciationMinor: number[]; yearEndBookValuesMinor: number[] } => {
  money(cost, "cost");
  money(salvage, "salvage");
  bounded(years, "years", 1, 1000);
  if (salvage > cost || !["ddb", "syd"].includes(method))
    return simpleError(
      "depreciation",
      "Cost ≥ salvage and declared ddb/syd method required.",
    );
  let book = cost;
  const charges: number[] = [],
    books: number[] = [],
    den = (years * (years + 1)) / 2;
  for (let i = 0; i < years; i++) {
    const candidate =
        i === years - 1
          ? book - salvage
          : method === "ddb"
            ? weightedMinor(book, 2, years)
            : weightedMinor(cost - salvage, years - i, den),
      charge =
        i === years - 1 ? book - salvage : Math.min(book - salvage, candidate);
    charges.push(charge);
    book -= charge;
    books.push(book);
  }
  return { annualDepreciationMinor: charges, yearEndBookValuesMinor: books };
};
