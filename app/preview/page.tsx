'use client';

import { ArrowRight, Footprints } from 'lucide-react';
import type { SandboxProduct } from '@/lib/sandbox/types';
import { enterPractice } from '@/components/features/walkthrough/practice-actions';
import '@/components/landing/landing.css';
import './preview.css';

const CHOICES: { product: SandboxProduct; label: string; audience: string; body: string }[] = [
	{ product: 'raise', label: 'Raise', audience: 'For Founders', body: 'Prepare for fundraising, strengthen your pitch and connect with relevant investors.' },
	{ product: 'scout', label: 'Scout', audience: 'For Investors', body: 'Discover companies matching your thesis, manage your pipeline and access curated deal flow.' },
];

/**
 * Pre-signup "The Warm-Up" chooser, linked from the landing page's CTAs. No
 * login, signup or onboarding: picking a product calls the exact same
 * `enterPractice` the real in-app entry points use
 * (components/features/walkthrough/practice-actions.ts), just landing on
 * `/preview/<product>/home` instead of the real `/home` — the only line that's
 * different between a logged-in user starting this and an anonymous visitor
 * starting it.
 */
export default function PreviewChooserPage() {
	return (
		<div className="lp wt-preview-choose">
			<div className="wt-preview-choose__inner">
				<div className="lp-howjoin-eyebrow"><span><Footprints size={13} aria-hidden="true" /> The Warm-Up</span><i /></div>
				<h1 className="lp-display wt-preview-choose__title">Explore Atlas</h1>
				<p className="wt-preview-choose__desc">Two sides of the investment journey. Choose a product to explore through an interactive warm-up.</p>
				<div className="wt-preview-choose__grid">
					{CHOICES.map((c) => (
						<button
							key={c.product}
							type="button"
							className="wt-preview-choose__card"
							onClick={() => enterPractice(c.product, 'landing-preview-chooser', `/preview/${c.product}/home`)}
						>
							<span className="wt-preview-choose__card-label">Atlas {c.label}: {c.audience}</span>
							<span className="wt-preview-choose__card-body">{c.body}</span>
							<span className="wt-preview-choose__card-go">Explore Atlas {c.label} <ArrowRight size={13} aria-hidden="true" /></span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
