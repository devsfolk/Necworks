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
  // Only non-personal labels such as machine slugs are allowed in event props.
  // Task 7 will send these events to Supabase.
  if (process.env.NODE_ENV === 'development') {
    console.debug('[analytics]', name, props ?? {});
  }
  // Vercel Hobby does not support custom events, so production custom events are a no-op.
}
