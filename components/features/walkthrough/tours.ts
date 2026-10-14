import { raiseTour } from '@/lib/sandbox/tours/raise-tour';
import { scoutTour } from '@/lib/sandbox/tours/scout-tour';
import type { Tour } from '@/lib/sandbox/tour-types';
import type { PracticeState } from '@/lib/sandbox/store';
import type { SandboxProduct } from '@/lib/sandbox/types';

/** One Warm-Up tour per product (lib/sandbox/tours). */
export const TOURS: Record<SandboxProduct, Tour> = { raise: raiseTour, scout: scoutTour };

/** Short product name for copy: "Raise" / "Scout". */
export const PRODUCT_NAME: Record<SandboxProduct, string> = { raise: 'Raise', scout: 'Scout' };

/**
 * Numbered steps as the visitor sees them: the welcome screen is step 1, then
 * one number per step — a `continues` step shares the number before it.
 */
export function stepNumbers(tour: Tour): { total: number; numberOf: (index: number) => number } {
	const numbers: number[] = [];
	tour.steps.forEach((s, i) => numbers.push(i === 0 ? 2 : numbers[i - 1] + (s.continues ? 0 : 1)));
	return { total: numbers.length ? numbers[numbers.length - 1] : 1, numberOf: (i) => numbers[i] ?? 1 };
}

/** True while the open tour step shows the sidebar expanded (its orientation step). */
export function tourExpandsNav(practice: PracticeState): boolean {
	if (!practice.active || practice.phase !== 'tour') return false;
	return !!TOURS[practice.active].steps[practice.step]?.expandNav;
}
