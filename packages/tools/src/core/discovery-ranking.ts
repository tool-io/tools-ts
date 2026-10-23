/** Keep only the requested ranking window; never sort every search match. */
export const boundedRank = <T>(
  candidates: readonly T[],
  capacity: number,
  scoreFor: (candidate: T) => number,
  idFor: (candidate: T) => string,
): { entries: { candidate: T; score: number }[]; total: number } => {
  type Match = { candidate: T; score: number };
  const heap: Match[] = [];
  const compare = (a: Match, b: Match): number =>
    b.score - a.score ||
    idFor(a.candidate).localeCompare(idFor(b.candidate), "en");
  let total = 0;
  for (const candidate of candidates) {
    const score = scoreFor(candidate);
    if (score < 0) continue;
    total++;
    const match = { candidate, score };
    if (capacity <= 0) continue;
    if (heap.length < capacity) {
      heap.push(match);
      let index = heap.length - 1;
      while (index > 0) {
        const parent = Math.floor((index - 1) / 2);
        if (compare(heap[index], heap[parent]) <= 0) break;
        [heap[parent], heap[index]] = [heap[index], heap[parent]];
        index = parent;
      }
    } else if (compare(match, heap[0]) < 0) {
      heap[0] = match;
      let index = 0;
      for (;;) {
        const left = 2 * index + 1;
        if (left >= heap.length) break;
        const right = left + 1;
        const worst =
          right < heap.length && compare(heap[right], heap[left]) > 0
            ? right
            : left;
        if (compare(heap[worst], heap[index]) <= 0) break;
        [heap[index], heap[worst]] = [heap[worst], heap[index]];
        index = worst;
      }
    }
  }
  return { entries: heap.sort(compare), total };
};
