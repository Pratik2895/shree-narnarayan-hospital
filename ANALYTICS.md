# Website analytics

The website records privacy-friendly events in Supabase `public.site_events`. It does **not** copy appointment names, phone numbers, child details, or messages into analytics.

## Events

- `page_view`: a page was loaded
- `booking_cta`: a visitor selected a website appointment button
- `booking_start`: a visitor focused the appointment form
- `booking_saved`: Supabase saved the appointment request
- `booking_failed`: the save timed out or failed
- `whatsapp_click`: a WhatsApp link was selected
- `call_click`: a phone link was selected
- `web_vitals`: page load timing and transfer size

## Useful Supabase reports

Run these in the Supabase SQL Editor. They return aggregate counts only.

### Last 30 days funnel

```sql
select
  event_name,
  count(*) as events,
  count(distinct session_id) as visitors
from public.site_events
where created_at >= now() - interval '30 days'
  and event_name in ('page_view', 'booking_cta', 'booking_start', 'booking_saved', 'booking_failed')
group by event_name
order by array_position(
  array['page_view', 'booking_cta', 'booking_start', 'booking_saved', 'booking_failed'],
  event_name
);
```

### Daily visitors and saved requests

```sql
select
  created_at::date as day,
  count(distinct session_id) filter (where event_name = 'page_view') as visitors,
  count(*) filter (where event_name = 'booking_saved') as saved_requests,
  count(*) filter (where event_name = 'booking_failed') as failed_requests
from public.site_events
where created_at >= now() - interval '30 days'
group by day
order by day;
```

### Traffic sources

```sql
select
  coalesce(referrer_host, 'direct') as source,
  count(distinct session_id) as visitors
from public.site_events
where created_at >= now() - interval '30 days'
  and event_name = 'page_view'
group by source
order by visitors desc;
```

## Access control

Anonymous website visitors can insert events but cannot read them. Reading analytics and appointment records requires an authenticated Supabase user whose `app_metadata.role` is `staff`. Supabase dashboard owners can always inspect the tables through the dashboard.

Before building a staff dashboard, assign the `staff` role only to approved family or reception accounts. Never put a Supabase service-role key in browser code.
