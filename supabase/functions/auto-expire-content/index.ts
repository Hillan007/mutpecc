import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate 48 hours ago
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - 48);

    // Unpublish expired events (48 hours after event_date)
    const { data: expiredEvents, error: eventsError } = await supabase
      .from('events')
      .update({ is_published: false })
      .eq('is_published', true)
      .lt('event_date', cutoffDate.toISOString())
      .select('id, title');

    if (eventsError) {
      console.error('Error expiring events:', eventsError);
    } else {
      console.log(`Expired ${expiredEvents?.length || 0} events`);
    }

    // Unpublish expired activities (48 hours after activity_date)
    const { data: expiredActivities, error: activitiesError } = await supabase
      .from('activities')
      .update({ is_published: false })
      .eq('is_published', true)
      .not('activity_date', 'is', null)
      .lt('activity_date', cutoffDate.toISOString())
      .select('id, title');

    if (activitiesError) {
      console.error('Error expiring activities:', activitiesError);
    } else {
      console.log(`Expired ${expiredActivities?.length || 0} activities`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        expiredEvents: expiredEvents?.length || 0,
        expiredActivities: expiredActivities?.length || 0,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in auto-expire function:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
