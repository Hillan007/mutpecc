import { useState, useEffect } from "react";
import { Calendar, Phone, Mail, CheckCircle, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface QuickBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  is_contacted: boolean;
  contacted_at: string | null;
  created_at: string;
}

export function BookingManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<QuickBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("quick_bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkContacted = async (bookingId: string) => {
    const { error } = await supabase
      .from("quick_bookings")
      .update({
        is_contacted: true,
        contacted_by: user?.id,
        contacted_at: new Date().toISOString(),
      })
      .eq("id", bookingId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Marked as Contacted",
        description: "Booking has been marked as contacted.",
      });
      fetchBookings();
    }
  };

  const pendingBookings = bookings.filter(b => !b.is_contacted);
  const contactedBookings = bookings.filter(b => b.is_contacted);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Quick Booking Requests
          {pendingBookings.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">
              {pendingBookings.length} pending
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No booking requests yet
          </p>
        ) : (
          <div className="space-y-6">
            {/* Pending Bookings */}
            {pendingBookings.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Pending Contact ({pendingBookings.length})
                </h4>
                <div className="space-y-3">
                  {pendingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 bg-secondary/50 rounded-xl border-l-4 border-amber-400"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-foreground">
                              {booking.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(booking.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <a href={`tel:${booking.phone}`} className="text-primary hover:underline">
                                {booking.phone}
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <a href={`mailto:${booking.email}`} className="text-primary hover:underline">
                                {booking.email}
                              </a>
                            </div>
                          </div>

                          {booking.message && (
                            <p className="text-sm text-muted-foreground bg-background p-2 rounded-lg">
                              "{booking.message}"
                            </p>
                          )}
                        </div>

                        <Button
                          variant="warm"
                          size="sm"
                          onClick={() => handleMarkContacted(booking.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Contacted
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contacted Bookings */}
            {contactedBookings.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Contacted ({contactedBookings.length})
                </h4>
                <div className="space-y-3">
                  {contactedBookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 bg-secondary/30 rounded-xl border-l-4 border-green-400"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <span className="font-medium text-foreground">{booking.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {booking.phone}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Contacted {booking.contacted_at && new Date(booking.contacted_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}