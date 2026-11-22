import {sendGAEvent} from '@next/third-parties/google';

export const analyticsEventNames = [
  'whatsapp_click',
  'phone_click',
  'email_click',
  'quote_click',
  'language_switch',
  'machine_tab_click'
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];
export type AnalyticsEventProps = {label?: string};

export function trackEvent(name: AnalyticsEventName, props?: AnalyticsEventProps) {
  // Event props may contain only non-personal labels such as machine slugs.
  // Task 7 will send these events to Supabase.
  if (process.env.NODE_ENV === 'development') {
    console.debug('[analytics]', name, props ?? {});
    return;
  }

  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && window.dataLayer) {
    sendGAEvent('event', name, props ?? {});
  }
}
