import { useState, useEffect } from "react";
import { Video, Calendar, Activity, Plus, Trash2, Edit2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { AddVlogModal } from "./AddVlogModal";
import { AddEventModal } from "./AddEventModal";
import { AddActivityModal } from "./AddActivityModal";
import type { Database } from "@/integrations/supabase/types";

type Vlog = Database["public"]["Tables"]["vlogs"]["Row"];
type Event = Database["public"]["Tables"]["events"]["Row"];
type ActivityItem = Database["public"]["Tables"]["activities"]["Row"];

export function ContentManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isVlogModalOpen, setIsVlogModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [vlogsRes, eventsRes, activitiesRes] = await Promise.all([
        supabase.from("vlogs").select("*").order("created_at", { ascending: false }),
        supabase.from("events").select("*").order("event_date", { ascending: true }),
        supabase.from("activities").select("*").order("created_at", { ascending: false }),
      ]);

      if (vlogsRes.data) setVlogs(vlogsRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
      if (activitiesRes.data) setActivities(activitiesRes.data);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (table: "vlogs" | "events" | "activities", id: string, currentState: boolean) => {
    const { error } = await supabase
      .from(table)
      .update({ is_published: !currentState })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update publish status.",
        variant: "destructive",
      });
    } else {
      toast({
        title: currentState ? "Unpublished" : "Published",
        description: `Content has been ${currentState ? "unpublished" : "published"}.`,
      });
      fetchContent();
    }
  };

  const handleDelete = async (table: "vlogs" | "events" | "activities", id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete content.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: `"${title}" has been deleted.`,
      });
      fetchContent();
    }
  };

  return (
    <>
      <Tabs defaultValue="vlogs" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="vlogs">Vlogs ({vlogs.length})</TabsTrigger>
          <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
          <TabsTrigger value="activities">Activities ({activities.length})</TabsTrigger>
        </TabsList>

        {/* Vlogs */}
        <TabsContent value="vlogs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                Vlogs
              </CardTitle>
              <Button variant="warm" size="sm" onClick={() => setIsVlogModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Vlog
              </Button>
            </CardHeader>
            <CardContent>
              {vlogs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No vlogs yet</p>
              ) : (
                <div className="space-y-3">
                  {vlogs.map((vlog) => (
                    <div key={vlog.id} className="p-4 bg-secondary/50 rounded-xl flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{vlog.title}</h4>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            vlog.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                          }`}>
                            {vlog.is_published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{vlog.description}</p>
                        <a href={vlog.youtube_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                          {vlog.youtube_url}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePublish("vlogs", vlog.id, vlog.is_published ?? true)}
                        >
                          {vlog.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete("vlogs", vlog.id, vlog.title)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events */}
        <TabsContent value="events">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Events
              </CardTitle>
              <Button variant="warm" size="sm" onClick={() => setIsEventModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Event
              </Button>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No events yet</p>
              ) : (
                <div className="space-y-3">
                  {events.map((event) => {
                    const isPast = new Date(event.event_date) < new Date();
                    return (
                      <div key={event.id} className={`p-4 bg-secondary/50 rounded-xl flex items-start justify-between gap-4 ${isPast ? "opacity-60" : ""}`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">{event.title}</h4>
                            {isPast && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                                Past
                              </span>
                            )}
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              event.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                            }`}>
                              {event.is_published ? "Published" : "Draft"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{event.description}</p>
                          <p className="text-xs text-primary mt-1">
                            {new Date(event.event_date).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {event.location && ` • ${event.location}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePublish("events", event.id, event.is_published ?? true)}
                          >
                            {event.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete("events", event.id, event.title)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities */}
        <TabsContent value="activities">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Activities
              </CardTitle>
              <Button variant="warm" size="sm" onClick={() => setIsActivityModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Activity
              </Button>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No activities yet</p>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="p-4 bg-secondary/50 rounded-xl flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {activity.activity_type || "General"}
                          </span>
                          <h4 className="font-semibold text-foreground">{activity.title}</h4>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            activity.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                          }`}>
                            {activity.is_published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePublish("activities", activity.id, activity.is_published ?? true)}
                        >
                          {activity.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete("activities", activity.id, activity.title)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddVlogModal isOpen={isVlogModalOpen} onClose={() => setIsVlogModalOpen(false)} onSuccess={fetchContent} />
      <AddEventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} onSuccess={fetchContent} />
      <AddActivityModal isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)} onSuccess={fetchContent} />
    </>
  );
}